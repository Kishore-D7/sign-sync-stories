
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Mic } from 'lucide-react';
import { translateToSignLanguage, enhancedTranslation, startSpeechRecognition } from '@/services/translationService';
import { toast } from '@/components/ui/sonner';
import { SignImage } from '@/data/signLanguageData';
import PageLayout from '@/components/PageLayout';
import TranslationInput from '@/components/translate/TranslationInput';
import VoiceInput from '@/components/translate/VoiceInput';
import TranslationResults from '@/components/translate/TranslationResults';

const Translate = () => {
  const { isAuthenticated } = useAuth();
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<SignImage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const stopRecognitionRef = useRef<{ stop: () => void } | null>(null);
  const playIntervalRef = useRef<number | null>(null);
  const [useEnhancedAI, setUseEnhancedAI] = useState(true);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      if (stopRecognitionRef.current) {
        stopRecognitionRef.current.stop();
      }
    };
  }, []);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to translate");
      return;
    }

    setIsTranslating(true);
    
    try {
      const translationResult = await (useEnhancedAI 
        ? enhancedTranslation(inputText)
        : translateToSignLanguage(inputText));
      
      setTranslation(translationResult);
      setCurrentSignIndex(0);
      
      if (translationResult.length > 0) {
        toast.success("Translation completed!");
      } else {
        toast.info("No translation results found");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setInputText('');
    
    stopRecognitionRef.current = startSpeechRecognition(
      (text) => {
        setInputText(text);
        setIsRecording(false);
        toast.success("Speech captured successfully");
      },
      (error) => {
        console.error("Speech recognition error:", error);
        setIsRecording(false);
        toast.error(error);
      }
    );
  };

  const handleStopRecording = () => {
    if (stopRecognitionRef.current) {
      stopRecognitionRef.current.stop();
      stopRecognitionRef.current = null;
      setIsRecording(false);
    }
  };

  const handlePlayTranslation = () => {
    if (translation.length === 0) return;
    
    setIsPlaying(true);
    setCurrentSignIndex(0);
    
    // Play through each sign with a delay
    playIntervalRef.current = window.setInterval(() => {
      setCurrentSignIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= translation.length) {
          clearInterval(playIntervalRef.current!);
          setIsPlaying(false);
          return 0;
        }
        return nextIndex;
      });
    }, 1500); // Show each sign for 1.5 seconds
  };

  const handlePauseTranslation = () => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleClearTranslation = () => {
    setInputText('');
    setTranslation([]);
    setCurrentSignIndex(0);
    handlePauseTranslation();
  };

  return (
    <PageLayout requireAuth={true}>
      <div className="max-w-5xl mx-auto">
        {/* Input Section */}
        <Tabs defaultValue="text" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Voice Input
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <TranslationInput
                  inputText={inputText}
                  isTranslating={isTranslating}
                  useEnhancedAI={useEnhancedAI}
                  handleInputChange={handleInputChange}
                  handleClearTranslation={handleClearTranslation}
                  handleTranslate={handleTranslate}
                  setUseEnhancedAI={setUseEnhancedAI}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <VoiceInput
                  inputText={inputText}
                  isRecording={isRecording}
                  isTranslating={isTranslating}
                  useEnhancedAI={useEnhancedAI}
                  handleStartRecording={handleStartRecording}
                  handleStopRecording={handleStopRecording}
                  handleTranslate={handleTranslate}
                  setUseEnhancedAI={setUseEnhancedAI}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Translation Results */}
        <div className="mb-6">
          <TranslationResults
            translation={translation}
            isPlaying={isPlaying}
            currentSignIndex={currentSignIndex}
            handlePlayTranslation={handlePlayTranslation}
            handlePauseTranslation={handlePauseTranslation}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Translate;

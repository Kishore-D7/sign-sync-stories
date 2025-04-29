
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  ArrowRight,
  RefreshCw, 
  Type, 
  LogOut, 
  User
} from 'lucide-react';
import { translateToSignLanguage, enhancedTranslation, startSpeechRecognition } from '@/services/translationService';
import { toast } from '@/components/ui/sonner';
import { SignImage } from '@/data/signLanguageData';
import PageLayout from '@/components/PageLayout';

const Translate = () => {
  const { isAuthenticated, logout, user } = useAuth();
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
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const translationResult = useEnhancedAI 
        ? enhancedTranslation(inputText)
        : translateToSignLanguage(inputText);
      
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
    <div className="min-h-screen bg-gradient-to-br from-signlang-purple/5 to-signlang-blue/5">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold gradient-text">Sign Sync</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center mr-2">
              <User className="h-4 w-4 text-signlang-dark-gray mr-1" />
              <span className="text-sm text-signlang-dark-gray">{user?.name || 'User'}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-signlang-dark-gray hover:text-signlang-purple"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
                  <Textarea 
                    placeholder="Enter text to translate to sign language..." 
                    className="min-h-[120px] mb-4"
                    value={inputText}
                    onChange={handleInputChange}
                  />
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enhancedAI"
                        className="h-4 w-4 rounded border-gray-300 text-signlang-purple focus:ring-signlang-purple"
                        checked={useEnhancedAI}
                        onChange={(e) => setUseEnhancedAI(e.target.checked)}
                      />
                      <label htmlFor="enhancedAI" className="text-sm text-muted-foreground">
                        Use enhanced AI processing
                      </label>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleClearTranslation}
                      >
                        Clear
                      </Button>
                      <Button
                        className="gradient-bg"
                        onClick={handleTranslate}
                        disabled={isTranslating || !inputText.trim()}
                      >
                        {isTranslating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          <>
                            Translate
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] mb-4">
                    {inputText ? (
                      <p className="text-center text-lg">{inputText}</p>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        {isRecording ? 'Listening...' : 'Click the microphone button to start speaking'}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enhancedAIVoice"
                        className="h-4 w-4 rounded border-gray-300 text-signlang-purple focus:ring-signlang-purple"
                        checked={useEnhancedAI}
                        onChange={(e) => setUseEnhancedAI(e.target.checked)}
                      />
                      <label htmlFor="enhancedAIVoice" className="text-sm text-muted-foreground">
                        Use enhanced AI processing
                      </label>
                    </div>
                    
                    <div className="flex space-x-2">
                      {isRecording ? (
                        <Button 
                          variant="destructive" 
                          onClick={handleStopRecording}
                        >
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={handleStartRecording}
                          className="border-signlang-purple/30 text-signlang-purple hover:bg-signlang-purple/10"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </Button>
                      )}
                      
                      <Button
                        className="gradient-bg"
                        onClick={handleTranslate}
                        disabled={isTranslating || !inputText.trim()}
                      >
                        {isTranslating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          <>
                            Translate
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Translation Results */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Translation Results</h2>
              
              {translation.length > 0 && (
                <div className="flex space-x-2">
                  {isPlaying ? (
                    <Button 
                      variant="outline" 
                      onClick={handlePauseTranslation}
                      className="text-signlang-dark-gray"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={handlePlayTranslation}
                      className="border-signlang-purple/30 text-signlang-purple hover:bg-signlang-purple/10"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {translation.length > 0 ? (
              <div>
                {/* Current sign being displayed (for play mode) */}
                {isPlaying && (
                  <div className="flex flex-col items-center mb-8">
                    <div className="sign-image-container p-4 mb-2">
                      <div className="relative w-full h-40 flex items-center justify-center animate-sign-image-appear">
                        <img 
                          src={translation[currentSignIndex].imageUrl} 
                          alt={translation[currentSignIndex].word}
                          className="h-full object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-lg font-medium">{translation[currentSignIndex].word}</p>
                  </div>
                )}
                
                {/* All signs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {translation.map((sign, index) => (
                    <div 
                      key={index}
                      className={`rounded-lg p-2 flex flex-col items-center ${
                        !isPlaying && "card-hover"
                      } ${
                        isPlaying && currentSignIndex === index 
                          ? "bg-signlang-purple/10 border border-signlang-purple/30" 
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="h-28 flex items-center justify-center mb-2">
                        <img 
                          src={sign.imageUrl} 
                          alt={sign.word} 
                          className="h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-center font-medium">{sign.word}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Enter text or speak to translate into sign language
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm py-4 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-signlang-dark-gray">
            Sign Sync - Audio and Text to Sign Language Translator &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Translate;

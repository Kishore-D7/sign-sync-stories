
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, ArrowRight, RefreshCw } from 'lucide-react';

interface VoiceInputProps {
  inputText: string;
  isRecording: boolean;
  isTranslating: boolean;
  useEnhancedAI: boolean;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleTranslate: () => void;
  setUseEnhancedAI: (value: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  inputText,
  isRecording,
  isTranslating,
  useEnhancedAI,
  handleStartRecording,
  handleStopRecording,
  handleTranslate,
  setUseEnhancedAI,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default VoiceInput;

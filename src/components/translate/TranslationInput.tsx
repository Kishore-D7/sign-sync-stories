
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface TranslationInputProps {
  inputText: string;
  isTranslating: boolean;
  useEnhancedAI: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleClearTranslation: () => void;
  handleTranslate: () => void;
  setUseEnhancedAI: (value: boolean) => void;
}

const TranslationInput: React.FC<TranslationInputProps> = ({
  inputText,
  isTranslating,
  useEnhancedAI,
  handleInputChange,
  handleClearTranslation,
  handleTranslate,
  setUseEnhancedAI,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default TranslationInput;

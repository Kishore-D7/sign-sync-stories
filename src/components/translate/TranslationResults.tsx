
import React from 'react';
import { SignImage } from '@/data/signLanguageData';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import SignCard from './SignCard';

interface TranslationResultsProps {
  translation: SignImage[];
  isPlaying: boolean;
  currentSignIndex: number;
  handlePlayTranslation: () => void;
  handlePauseTranslation: () => void;
}

const TranslationResults: React.FC<TranslationResultsProps> = ({
  translation,
  isPlaying,
  currentSignIndex,
  handlePlayTranslation,
  handlePauseTranslation,
}) => {
  if (translation.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-center">
          Enter text or speak to translate into sign language
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Translation Results</h2>
        
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
      </div>
      
      {/* Current sign being displayed (for play mode) */}
      {isPlaying && (
        <div className="flex flex-col items-center mb-8">
          <div className="sign-image-container p-4 mb-2">
            <div className="relative w-full h-40 flex items-center justify-center">
              <img 
                src={translation[currentSignIndex].imageUrl} 
                alt={translation[currentSignIndex].word}
                className="h-full object-contain sign-image"
              />
            </div>
          </div>
          <p className="text-lg font-medium">{translation[currentSignIndex].word}</p>
        </div>
      )}
      
      {/* All signs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {translation.map((sign, index) => (
          <SignCard 
            key={index}
            sign={sign}
            isHighlighted={isPlaying && currentSignIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default TranslationResults;


import React from 'react';
import { SignImage } from '@/data/signLanguageData';

interface SignCardProps {
  sign: SignImage;
  isHighlighted?: boolean;
}

const SignCard: React.FC<SignCardProps> = ({ sign, isHighlighted = false }) => {
  return (
    <div 
      className={`rounded-lg p-2 flex flex-col items-center card-hover ${
        isHighlighted 
          ? "bg-signlang-purple/10 border border-signlang-purple/30" 
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="h-28 flex items-center justify-center mb-2">
        <img 
          src={sign.imageUrl} 
          alt={sign.word} 
          className="h-full object-contain sign-image"
        />
      </div>
      <p className="text-sm text-center font-medium">{sign.word}</p>
    </div>
  );
};

export default SignCard;

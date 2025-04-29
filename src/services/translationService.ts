import { signLanguageDatabase, fallbackImage, type SignImage } from '@/data/signLanguageData';

// Simple NLP preprocessing - This simulates more advanced AI techniques
// but keeps the demo performant in the browser
const preprocessText = (text: string): string[] => {
  // Convert to lowercase
  const lowerText = text.toLowerCase();
  
  // Remove punctuation and extra spaces
  const cleanText = lowerText.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " ").trim();
  
  // Tokenize into words
  return cleanText.split(' ');
};

// Perform word-by-word translation
export const translateToSignLanguage = (text: string): SignImage[] => {
  // Get individual words
  const words = preprocessText(text);
  
  // Find corresponding sign language images
  return words.map(word => {
    const signImage = signLanguageDatabase.find(item => item.word === word);
    return signImage || { ...fallbackImage, word };
  });
};

// Simulate advanced AI processing for better results
// In a real app, this would use an actual NLP/AI algorithm
export const enhancedTranslation = (text: string): SignImage[] => {
  console.log('Performing enhanced AI translation...');
  
  // Simple for demo - a real implementation would use more sophisticated techniques
  const words = preprocessText(text);
  
  // Process word by word, with context awareness
  const result: SignImage[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const nextWord = i < words.length - 1 ? words[i + 1] : null;
    
    // Skip articles and certain prepositions for more natural translation
    if (['a', 'an', 'the', 'of', 'in', 'on', 'at'].includes(currentWord)) {
      continue;
    }
    
    // Handle certain word combinations (simple example of context)
    if (currentWord === 'thank' && nextWord === 'you') {
      result.push(signLanguageDatabase.find(item => item.word === 'thank') || { ...fallbackImage, word: 'thank you' });
      i++; // Skip the next word since we've processed it
    } else {
      // Regular lookup
      const signImage = signLanguageDatabase.find(item => item.word === currentWord);
      result.push(signImage || { ...fallbackImage, word: currentWord });
    }
  }
  
  return result;
};

// Speech recognition
export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onError: (error: string) => void
): { stop: () => void } => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition not supported in this browser');
    return { stop: () => {} };
  }

  // Use the Speech Recognition API
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };

  recognition.start();

  return {
    stop: () => recognition.stop()
  };
};

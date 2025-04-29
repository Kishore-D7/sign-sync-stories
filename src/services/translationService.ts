import { SignImage } from '@/data/signLanguageData';
import { supabase } from '@/integrations/supabase/client';

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

// Fetch sign images from Supabase database
const fetchSignImages = async (words: string[]): Promise<SignImage[]> => {
  if (words.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('sign_images')
      .select('word, image_url, category')
      .in('word', words);
    
    if (error) {
      console.error('Error fetching sign images:', error);
      throw error;
    }
    
    // Map the data to SignImage type
    return words.map(word => {
      const signImage = data?.find(item => item.word === word);
      
      // If found in database, use it
      if (signImage) {
        return {
          word: signImage.word,
          imageUrl: signImage.image_url,
          category: signImage.category || undefined
        };
      } 
      
      // Otherwise use fallback from local data
      return { 
        word, 
        imageUrl: '/placeholder.svg',
        category: 'unknown'
      };
    });
  } catch (error) {
    console.error('Failed to fetch sign images:', error);
    
    // Return placeholder images as fallback
    return words.map(word => ({ 
      word, 
      imageUrl: '/placeholder.svg',
      category: 'unknown'
    }));
  }
};

// Perform word-by-word translation
export const translateToSignLanguage = async (text: string): Promise<SignImage[]> => {
  // Get individual words
  const words = preprocessText(text);
  
  // Fetch corresponding sign language images
  return await fetchSignImages(words);
};

// Simulate advanced AI processing for better results
// In a real app, this would use an actual NLP/AI algorithm
export const enhancedTranslation = async (text: string): Promise<SignImage[]> => {
  console.log('Performing enhanced AI translation...');
  
  // Simple for demo - a real implementation would use more sophisticated techniques
  const words = preprocessText(text);
  
  // Process word by word, with context awareness
  const processedWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const nextWord = i < words.length - 1 ? words[i + 1] : null;
    
    // Skip articles and certain prepositions for more natural translation
    if (['a', 'an', 'the', 'of', 'in', 'on', 'at'].includes(currentWord)) {
      continue;
    }
    
    // Handle certain word combinations (simple example of context)
    if (currentWord === 'thank' && nextWord === 'you') {
      processedWords.push('thank');
      i++; // Skip the next word since we've processed it
    } else {
      processedWords.push(currentWord);
    }
  }
  
  return await fetchSignImages(processedWords);
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

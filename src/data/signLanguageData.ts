
// This simulates a database of sign language images
// In a real application, this would come from an actual database

export interface SignImage {
  word: string;
  imageUrl: string;
  category?: string;
}

// Sample database of common words and their sign images
// In a real application, these would be proper URLs to images
export const signLanguageDatabase: SignImage[] = [
  { 
    word: 'hello', 
    imageUrl: 'https://www.handspeak.com/word/h/hello.gif', 
    category: 'greetings' 
  },
  { 
    word: 'goodbye', 
    imageUrl: 'https://www.handspeak.com/word/g/goodbye.gif', 
    category: 'greetings' 
  },
  { 
    word: 'thank', 
    imageUrl: 'https://www.handspeak.com/word/t/thank-you.gif', 
    category: 'expressions' 
  },
  { 
    word: 'please', 
    imageUrl: 'https://www.handspeak.com/word/p/please.gif', 
    category: 'expressions' 
  },
  { 
    word: 'yes', 
    imageUrl: 'https://www.handspeak.com/word/y/yes.gif', 
    category: 'common' 
  },
  { 
    word: 'no', 
    imageUrl: 'https://www.handspeak.com/word/n/no.gif', 
    category: 'common' 
  },
  { 
    word: 'help', 
    imageUrl: 'https://www.handspeak.com/word/h/help.gif', 
    category: 'common' 
  },
  { 
    word: 'want', 
    imageUrl: 'https://www.handspeak.com/word/w/want.gif', 
    category: 'common' 
  },
  { 
    word: 'like', 
    imageUrl: 'https://www.handspeak.com/word/l/like.gif', 
    category: 'emotions' 
  },
  { 
    word: 'love', 
    imageUrl: 'https://www.handspeak.com/word/l/love.gif', 
    category: 'emotions' 
  },
  { 
    word: 'happy', 
    imageUrl: 'https://www.handspeak.com/word/h/happy.gif', 
    category: 'emotions' 
  },
  { 
    word: 'sad', 
    imageUrl: 'https://www.handspeak.com/word/s/sad.gif', 
    category: 'emotions' 
  },
  { 
    word: 'angry', 
    imageUrl: 'https://www.handspeak.com/word/a/angry.gif', 
    category: 'emotions' 
  },
  { 
    word: 'good', 
    imageUrl: 'https://www.handspeak.com/word/g/good.gif', 
    category: 'common' 
  },
  { 
    word: 'bad', 
    imageUrl: 'https://www.handspeak.com/word/b/bad.gif', 
    category: 'common' 
  },
  { 
    word: 'how', 
    imageUrl: 'https://www.handspeak.com/word/h/how.gif', 
    category: 'questions' 
  },
  { 
    word: 'what', 
    imageUrl: 'https://www.handspeak.com/word/w/what.gif', 
    category: 'questions' 
  },
  { 
    word: 'when', 
    imageUrl: 'https://www.handspeak.com/word/w/when.gif', 
    category: 'questions' 
  },
  { 
    word: 'where', 
    imageUrl: 'https://www.handspeak.com/word/w/where.gif', 
    category: 'questions' 
  },
  { 
    word: 'who', 
    imageUrl: 'https://www.handspeak.com/word/w/who.gif', 
    category: 'questions' 
  },
  { 
    word: 'why', 
    imageUrl: 'https://www.handspeak.com/word/w/why.gif', 
    category: 'questions' 
  },
  { 
    word: 'time', 
    imageUrl: 'https://www.handspeak.com/word/t/time.gif', 
    category: 'concepts' 
  },
  { 
    word: 'day', 
    imageUrl: 'https://www.handspeak.com/word/d/day.gif', 
    category: 'time' 
  },
  { 
    word: 'night', 
    imageUrl: 'https://www.handspeak.com/word/n/night.gif', 
    category: 'time' 
  },
  { 
    word: 'today', 
    imageUrl: 'https://www.handspeak.com/word/t/today.gif', 
    category: 'time' 
  },
  { 
    word: 'tomorrow', 
    imageUrl: 'https://www.handspeak.com/word/t/tomorrow.gif', 
    category: 'time' 
  },
  { 
    word: 'yesterday', 
    imageUrl: 'https://www.handspeak.com/word/y/yesterday.gif', 
    category: 'time' 
  },
  { 
    word: 'name', 
    imageUrl: 'https://www.handspeak.com/word/n/name.gif', 
    category: 'identity' 
  },
  { 
    word: 'my', 
    imageUrl: 'https://www.handspeak.com/word/m/my.gif', 
    category: 'possession' 
  },
  { 
    word: 'your', 
    imageUrl: 'https://www.handspeak.com/word/y/your.gif', 
    category: 'possession' 
  }
];

// Fallback image for words not in our database
export const fallbackImage = {
  word: 'unknown',
  imageUrl: 'https://www.handspeak.com/word/s/spell.gif',
  category: 'system'
};

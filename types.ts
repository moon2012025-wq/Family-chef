
export enum Language {
  AR = 'ar',
  EN = 'en'
}

export enum DietType {
  NONE = 'none',
  VEGAN = 'vegan',
  KETO = 'keto',
  PALEO = 'paleo',
  GLUTEN_FREE = 'gluten_free'
}

export enum Disease {
  DIABETES = 'diabetes',
  HYPERTENSION = 'hypertension',
  CELIAC = 'celiac',
  NONE = 'none'
}

export enum Region {
  INTERNATIONAL = 'international',
  GULF = 'gulf',
  EGYPTIAN = 'egyptian',
  LEVANT = 'levant',
  MAGHREB = 'maghreb'
}

export interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  diseases: Disease[];
  diet: DietType;
  mode: 'free' | 'calculated';
  region: Region;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  calories?: number;
  prepTime: string;
  detectedIngredients: string[];
  timestamp: number;
  isMealAnalysis?: boolean;
}

export interface AppState {
  language: Language;
  userProfile: UserProfile;
  history: Recipe[];
}

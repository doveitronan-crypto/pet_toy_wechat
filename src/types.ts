export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number; // in years
  energyLevel: 'low' | 'medium' | 'high';
  chewStrength: 'gentle' | 'normal' | 'aggressive';
  avatarUrl?: string;
}

export interface Toy {
  id: string;
  name: string;
  category: 'puzzle' | 'chew' | 'squeak' | 'active';
  categoryLabel: string;
  imageUrl: string;
  rating: number;
  tags: string[];
  description: string;
  playGuide: string;
  safetyWarning: string;
  matchReason?: string;
  suitabilityScore?: number; // 0-100
  purchaseUrl?: string;
}

export interface BlindBoxHistory {
  id: string;
  petId: string;
  petName: string;
  openedAt: string;
  toy: Toy;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

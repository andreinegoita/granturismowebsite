export interface User{
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

export interface Game{
    id: number;
    title: string;
    releaseYear: number;
    platform: string;
    description: string;
    imageUrls: string[];
    rating?: number;
}

export interface AuthContextType{
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string,email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface Review {
    id?: number;
    userId: number;
    gameId: number;
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    username?: string;
    createdAt?: Date | string; 
    updatedAt?: Date | string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
    loading: boolean;
}

export interface UserGameProgress {
  id: number;
  userId: number;
  gameId: number;
  completionPercentage: number;
  hoursPlayed: number;
  creditsEarned: number;
  totalRaces: number;
  racesWon: number;
  lastPlayed: string;
  gameTitle?: string;
  imageUrls?: string[];
  releaseYear?: number;
}

export interface License {
  id: number;
  name: string;
  code: string;
  description: string;
  difficulty: number;
  iconUrl?: string;
}

export interface UserLicense {
  id: number;
  userId: number;
  licenseId: number;
  gameId: number;
  status: 'bronze' | 'silver' | 'gold';
  testsCompleted: number;
  totalTests: number;
  bestTime?: number;
  obtainedAt: string;
  licenseName?: string;
  licenseCode?: string;
  gameName?: string;
}

export interface Car {
  id: number;
  name: string;
  manufacturer: string;
  year?: number;
  class?: string;
  horsepower?: number;
  weight?: number;
  price?: number;
  imageUrl?: string;
  gameId?: number;
}

export interface UserCar {
  id: number;
  userId: number;
  carId: number;
  gameId: number;
  mileage: number;
  timesUsed: number;
  isFavorite: boolean;
  acquiredAt: string;
  carName?: string;
  manufacturer?: string;
  imageUrl?: string;
}

export interface Track {
  id: number;
  name: string;
  location?: string;
  country?: string;
  lengthKm?: number;
  corners?: number;
  type?: string;
  imageUrl?: string;
  gameId?: number;
}

export interface TrackRecord {
  id: number;
  userId: number;
  trackId: number;
  carId: number;
  gameId: number;
  lapTime: number;
  sector1?: number;
  sector2?: number;
  sector3?: number;
  weather?: string;
  tyreCompound?: string;
  isAssisted: boolean;
  achievedAt: string;
  trackName?: string;
  carName?: string;
  username?: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  points: number;
  iconUrl?: string;
  requirementType: string;
  requirementValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  gameId: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  achievementName?: string;
  description?: string;
  points?: number;
  iconUrl?: string;
  requirementValue?: number;
}
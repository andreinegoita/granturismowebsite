export class Achievement {
  id?: number;
  name: string;
  description: string;
  category: string;
  points: number;
  iconUrl?: string;
  requirementType: string;
  requirementValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt?: Date;

  constructor(name: string, description: string, category: string, points: number) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.points = points;
    this.requirementType = '';
    this.requirementValue = 0;
    this.rarity = 'common';
  }
}

export class UserAchievement {
  id?: number;
  userId: number;
  achievementId: number;
  gameId: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;

  achievementName?: string;
  description?: string;
  points?: number;
  iconUrl?: string;
  requirementValue?: number;

  constructor(userId: number, achievementId: number, gameId: number) {
    this.userId = userId;
    this.achievementId = achievementId;
    this.gameId = gameId;
    this.progress = 0;
    this.unlocked = false;
  }

  getProgressPercentage(): number {
    if (!this.requirementValue) return 0;
    return Math.min((this.progress / this.requirementValue) * 100, 100);
  }
}
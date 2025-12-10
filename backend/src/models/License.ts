export class License {
  id?: number;
  name: string;
  code: string;
  description: string;
  difficulty: number;
  iconUrl?: string;
  createdAt?: Date;

  constructor(name: string, code: string, description: string, difficulty: number) {
    this.name = name;
    this.code = code;
    this.description = description;
    this.difficulty = difficulty;
  }
}

export class UserLicense {
  id?: number;
  userId: number;
  licenseId: number;
  gameId: number;
  status: 'bronze' | 'silver' | 'gold';
  testsCompleted: number;
  totalTests: number;
  bestTime?: number;
  obtainedAt?: Date;

  licenseName?: string;
  licenseCode?: string;
  gameName?: string;

  constructor(userId: number, licenseId: number, gameId: number) {
    this.userId = userId;
    this.licenseId = licenseId;
    this.gameId = gameId;
    this.status = 'bronze';
    this.testsCompleted = 0;
    this.totalTests = 10;
  }

  getCompletionPercentage(): number {
    return (this.testsCompleted / this.totalTests) * 100;
  }

  isCompleted(): boolean {
    return this.testsCompleted >= this.totalTests;
  }
}
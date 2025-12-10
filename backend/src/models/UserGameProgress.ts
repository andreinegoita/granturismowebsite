export class UserGameProgress {
  id?: number;
  userId: number;
  gameId: number;
  completionPercentage: number;
  hoursPlayed: number;
  creditsEarned: number;
  totalRaces: number;
  racesWon: number;
  lastPlayed?: Date;
  startedAt?: Date;

  constructor(userId: number, gameId: number) {
    this.userId = userId;
    this.gameId = gameId;
    this.completionPercentage = 0;
    this.hoursPlayed = 0;
    this.creditsEarned = 0;
    this.totalRaces = 0;
    this.racesWon = 0;
  }

  calculateWinRate(): number {
    if (this.totalRaces === 0) return 0;
    return (this.racesWon / this.totalRaces) * 100;
  }

  updateProgress(racesWon: number, hoursPlayed: number, credits: number): void {
    this.racesWon += racesWon;
    this.totalRaces += 1;
    this.hoursPlayed += hoursPlayed;
    this.creditsEarned += credits;
    this.lastPlayed = new Date();
  }
}
export class Track {
  id?: number;
  name: string;
  location?: string;
  country?: string;
  lengthKm?: number;
  corners?: number;
  type?: string;
  imageUrl?: string;
  gameId?: number;
  createdAt?: Date;

  constructor(name: string) {
    this.name = name;
  }
}

export class TrackRecord {
  id?: number;
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
  achievedAt?: Date;

  trackName?: string;
  carName?: string;
  username?: string;

  constructor(userId: number, trackId: number, carId: number, gameId: number, lapTime: number) {
    this.userId = userId;
    this.trackId = trackId;
    this.carId = carId;
    this.gameId = gameId;
    this.lapTime = lapTime;
    this.isAssisted = false;
  }

  formatLapTime(): string {
    const minutes = Math.floor(this.lapTime / 60);
    const seconds = (this.lapTime % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  }
}
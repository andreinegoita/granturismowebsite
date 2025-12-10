export class Car {
  id?: number;
  name: string;
  manufacturer: string;
  year?: number;
  class?: string;
  horsepower?: number;
  weight?: number;
  price?: number;
  imageUrl?: string;
  gameId?: number;
  createdAt?: Date;

  constructor(name: string, manufacturer: string) {
    this.name = name;
    this.manufacturer = manufacturer;
  }

  getPerformanceRating(): string {
    if (!this.horsepower) return 'Unknown';
    if (this.horsepower < 150) return 'Economy';
    if (this.horsepower < 250) return 'Sport';
    if (this.horsepower < 400) return 'Performance';
    if (this.horsepower < 600) return 'Super';
    return 'Hypercar';
  }
}

export class UserCar {
  id?: number;
  userId: number;
  carId: number;
  gameId: number;
  mileage: number;
  timesUsed: number;
  isFavorite: boolean;
  acquiredAt?: Date;

  carName?: string;
  manufacturer?: string;
  imageUrl?: string;

  constructor(userId: number, carId: number, gameId: number) {
    this.userId = userId;
    this.carId = carId;
    this.gameId = gameId;
    this.mileage = 0;
    this.timesUsed = 0;
    this.isFavorite = false;
  }
}
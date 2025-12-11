import axios from "axios";
import type { 
  Game, 
  LoginData, 
  RegisterData, 
  Review 
} from "../types";

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data)
};

export const gameService = {
  getAll: () => api.get<Game[]>('/games'),
  getById: (id: number) => api.get<Game>(`/games/${id}`),
  create: (data: Game) => api.post('/games', data),
  update: (id: number, data: Game) => api.put(`/games/${id}`, data),
  delete: (id: number) => api.delete(`/games/${id}`)
};

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const reviewService = {
  getByGame: (gameId: number) =>
    api.get<ReviewsResponse>(`/games/${gameId}/reviews?_t=${Date.now()}`),

  create: (data: Partial<Review>) =>
    api.post<Review>('/reviews', data),

  delete: (id: number) => api.delete(`/reviews/${id}`),

  like: (id: number) => api.post(`/reviews/${id}/like`, {}),

  dislike: (id: number) => api.post(`/reviews/${id}/dislike`, {})
};


export interface ProgressUpdateRequest {
  completionPercentage?: number;
  hoursPlayed?: number;
  creditsEarned?: number;
  totalRaces?: number;
  racesWon?: number;
}

export interface RaceRecordRequest {
  gameId: number;
  trackId: number;
  carId: number;
  lapTime: number;
}

export const progressService = {
  getUserProgress: () => api.get('/progress'),

  getGameProgress: (gameId: number) =>
    api.get(`/progress/${gameId}`),

  getStats: () => api.get('/progress/stats'),

  startGame: (gameId: number) =>
    api.post('/progress/start', { gameId }),

  updateProgress: (gameId: number, data: ProgressUpdateRequest) =>
    api.put(`/progress/${gameId}`, data),

  recordRace: (data: RaceRecordRequest) =>
    api.post('/progress/race', data)
};


export interface LicenseProgressUpdate {
  testsCompleted?: number;
  bestTime?: number;
  status?: 'bronze' | 'silver' | 'gold';
}

export const licenseService = {
  getAllLicenses: () => api.get('/licenses/all'),

  getUserLicenses: (gameId?: number) =>
    api.get('/licenses/my-licenses', { params: { gameId } }),

  getStats: () => api.get('/licenses/stats'),

  startLicense: (data: { licenseId: number; gameId: number }) =>
    api.post('/licenses/start', data),

  updateProgress: (id: number, data: LicenseProgressUpdate) =>
    api.put(`/licenses/${id}`, data)
};


export interface CarUsageRequest {
  carId: number;
  gameId: number;
  distanceKm?: number;
}

export const carService = {
  getAllCars: (gameId?: number) =>
    api.get('/cars/all', { params: { gameId } }),

  getUserGarage: (gameId?: number) =>
    api.get('/cars/garage', { params: { gameId } }),

  getStats: () => api.get('/cars/stats'),

  addToGarage: (data: { carId: number; gameId: number }) =>
    api.post('/cars/add', data),

  toggleFavorite: (id: number, isFavorite: boolean) =>
    api.put(`/cars/${id}/favorite`, { isFavorite }),

  recordUsage: (data: CarUsageRequest) =>
    api.post('/cars/usage', data)
};


export interface SubmitRecordRequest {
  trackId: number;
  gameId: number;
  carId: number;
  lapTime: number;
  sector1?: number;
  sector2?: number;
  sector3?: number;
  weather?: string;
  tyreCompound?: string;
  isAssisted?: boolean;
}

export const trackService = {
  getAllTracks: (gameId?: number) =>
    api.get('/tracks/all', { params: { gameId } }),

  getTrackById: (id: number) =>
    api.get(`/tracks/${id}`),

  getLeaderboard: (trackId: number, gameId: number, limit?: number) =>
    api.get(`/tracks/leaderboard/${trackId}/${gameId}`, {
      params: { limit }
    }),

  getUserRecords: (gameId?: number) =>
    api.get('/tracks/my-records/all', { params: { gameId } }),

  getBestLap: (trackId: number, gameId: number) =>
    api.get(`/tracks/best-lap/${trackId}/${gameId}`),

  getStats: () =>
    api.get('/tracks/stats/user'),

  submitRecord: (data: SubmitRecordRequest) =>
    api.post('/tracks/record', data)
};

/* ---------- ACHIEVEMENTS ---------- */
export const achievementService = {
  getAllAchievements: () => api.get('/achievements/all'),

  getUserAchievements: (gameId?: number) =>
    api.get('/achievements/my-achievements', { params: { gameId } }),

  getStats: () => api.get('/achievements/stats')
};

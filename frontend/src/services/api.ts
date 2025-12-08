import axios from "axios";
import type { Game, LoginData, RegisterData, Review } from "../types";

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
        if(token){
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
  getAll: () => api.get('/games'),
  getById: (id: number) => api.get(`/games/${id}`),
  create: (data: Game) => api.post('/games', data),
  update: (id: number, data: Game) => api.put(`/games/${id}`, data),
  delete: (id: number) => api.delete(`/games/${id}`)
};


export const reviewService = {
 getByGame: (gameId: number) => api.get<ReviewsResponse>(`/games/${gameId}/reviews?_t=${new Date().getTime()}`),
 create: (data: Partial<Review>) => api.post<Review>('/reviews', data),
 delete: (id: number) => api.delete(`/reviews/${id}`),
 like: (id: number) => api.post(`/reviews/${id}/like`),
 dislike: (id: number) => api.post(`/reviews/${id}/dislike`)
};

export interface ReviewsResponse {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}
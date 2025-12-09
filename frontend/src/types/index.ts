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
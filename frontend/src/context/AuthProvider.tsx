import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/api';
import type { User } from '../types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Definim state-urile
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // CRITIC: 'loading' începe ca true pentru a bloca rutele protejate până la verificare
  const [loading, setLoading] = useState(true);

  // 2. useEffect care rulează O SINGURĂ DATĂ la pornirea aplicației
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Eroare la citirea datelor de autentificare:", error);
        // Dacă datele sunt corupte, le ștergem preventiv
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        // 3. FOARTE IMPORTANT: Setăm loading pe false INDIFERENT dacă am găsit user sau nu.
        // Asta semnalează aplicației că verificarea inițială s-a terminat.
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // Presupunem că backend-ul returnează { token: "...", user: { ... } }
      // Ajustează aici dacă structura ta e diferită (ex: response.data.data.token)
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Aruncăm eroarea mai departe pentru a fi afișată în UI (Login.tsx)
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.register({ username, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
    } catch (error) {
      console.error("Register failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Opțional: Poți face reload la pagină sau redirect
    // window.location.href = '/login';
  };

  // Helper pentru verificarea rolului
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isAdmin, 
      loading // 4. Exportăm loading-ul către restul aplicației
    }}>
      {children}
    </AuthContext.Provider>
  );
};
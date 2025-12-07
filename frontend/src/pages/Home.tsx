import React, { useEffect, useState } from 'react';
import { gameService } from '../services/api';
import type { Game } from '../types';
import { Carousel } from '../components/Carousel';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await gameService.getAll();
      setGames(response.data);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <header className="hero">
        <h1>🏎️ Gran Turismo Series</h1>
        <p>The Real Driving Simulator - From GT1 to GT7</p>
      </header>

      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h2>{game.title}</h2>
            <p className="year">{game.releaseYear} • {game.platform}</p>
            
            {game.imageUrls && game.imageUrls.length > 0 && (
              <Carousel images={game.imageUrls} />
            )}
            
            <p className="description">{game.description}</p>
            
            <Link to={`/games/${game.id}`} className="details-link">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
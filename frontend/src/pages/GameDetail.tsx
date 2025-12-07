import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/api';
import type { Game } from '../types';
import { Carousel } from '../components/Carousel';
import '../styles/GameDetail.css';

export const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await gameService.getById(Number(id));
      setGame(response.data);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!game) return <div className="error">Game not found</div>;

  return (
    <div className="game-detail">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Games
      </button>

      <div className="detail-header">
        <h1>{game.title}</h1>
        <p className="meta">{game.releaseYear} • {game.platform}</p>
      </div>

      {game.imageUrls && game.imageUrls.length > 0 && (
        <div className="detail-carousel">
          <Carousel images={game.imageUrls} autoPlay={true} interval={4000} />
        </div>
      )}

      <div className="detail-content">
        <h2>About this game</h2>
        <p>{game.description}</p>
        
        {game.rating && (
          <div className="rating">
            <span>⭐ Rating: {game.rating}/5</span>
          </div>
        )}
      </div>
    </div>
  );
};
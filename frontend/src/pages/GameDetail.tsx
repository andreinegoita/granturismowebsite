import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { gameService, reviewService } from '../services/api';
import type { Game, Review } from '../types';
import { Carousel } from '../components/Carousel';
import { ReviewList } from '../components/ReviewList'; 
import { ReviewForm } from '../components/ReviewForm'; 
import { useAuth } from '../context/useAuth';
import '../styles/GameDetail.css';

export const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadGame = useCallback(async () => {
    try {
      if (!id) return;
      const response = await gameService.getById(Number(id));
      setGame(response.data);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    try {
      if (!id) return;
      
      const response = await reviewService.getByGame(Number(id));
      
      console.log("Response Data:", response.data);


      const reviewsList = response.data.reviews || response.data; 

      if (Array.isArray(reviewsList)) {
          setReviews(reviewsList);
      } else {
          setReviews([]);
      }
      
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]); 
    }
}, [id]);

  useEffect(() => {
    loadGame();
    loadReviews();
  }, [loadGame, loadReviews]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
    : 0;

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
        
        <div className="rating">
           <span>⭐ Rating: {averageRating.toFixed(1)} / 5 ({reviews.length} votes)</span>
        </div>
      </div>

      <hr className="divider" />

      <div className="reviews-section">
        {user ? (
          <ReviewForm 
            gameId={game.id} 
            onReviewAdded={loadReviews} 
          />
        ) : (
          <div className="login-prompt">
            <p>
              Want to share your thoughts? <Link to="/login">Log in</Link> to write a review.
            </p>
          </div>
        )}
        
        <ReviewList 
          reviews={reviews}
          averageRating={averageRating}
          onReviewUpdated={loadReviews}
        />
      </div>
    </div>
  );
};
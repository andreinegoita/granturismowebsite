import React, { useState } from 'react';
import { reviewService } from '../services/api';
import '../styles/ReviewForm.css';
import { AxiosError } from 'axios';


interface ReviewFormProps {
  gameId: number;
  onReviewAdded: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ gameId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await reviewService.create({ gameId, rating, comment });
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(axiosErr.response?.data?.message || 'Failed to submit review');
    }
        finally {
            setLoading(false);
        }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      
      {error && <div className="error">{error}</div>}

      <div className="rating-selector">
        <label>Rating:</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'active' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Share your thoughts about this game (minimum 10 characters)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        minLength={10}
        maxLength={1000}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
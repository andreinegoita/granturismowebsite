import React from 'react';
import type { Review } from '../types';
import { useAuth } from '../context/useAuth';
import { reviewService } from '../services/api';
import '../styles/ReviewList.css';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  onReviewUpdated: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  averageRating,
  onReviewUpdated 
}) => {
  const { user } = useAuth();

  const handleLike = async (reviewId: number) => {
    try {
      await reviewService.like(reviewId);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const handleDislike = async (reviewId: number) => {
    try {
      await reviewService.dislike(reviewId);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to dislike review:', error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.delete(reviewId);
        onReviewUpdated();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  return (
    <div className="review-list">
      <div className="review-summary">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length > 0 && (
          <div className="average-rating">
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <span className="stars">
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-author">
                <strong>{review.username}</strong>
                <span className="review-date">
                  {new Date(review.createdAt!).toLocaleDateString()}
                </span>
              </div>
              <div className="review-rating">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>

            <p className="review-comment">{review.comment}</p>

            <div className="review-actions">
              <button onClick={() => handleLike(review.id!)} className="like-btn">
                👍 {review.likes || 0}
              </button>
              <button onClick={() => handleDislike(review.id!)} className="dislike-btn">
                👎 {review.dislikes || 0}
              </button>

              {user && (user.id === review.userId || user.role === 'admin') && (
                <button onClick={() => handleDelete(review.id!)} className="delete-btn">
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
import { Review } from '../models/Review';

describe('Review Model', () => {
  test('should validate correct rating', () => {
    const review = new Review(1, 1, 5, 'Great game!');
    expect(review.validateRating()).toBe(true);
  });

  test('should invalidate rating above 5', () => {
    const review = new Review(1, 1, 6, 'Test');
    expect(review.validateRating()).toBe(false);
  });

  test('should invalidate rating below 1', () => {
    const review = new Review(1, 1, 0, 'Test');
    expect(review.validateRating()).toBe(false);
  });
});
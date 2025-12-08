import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import { createAuthRouter } from './routes/auth.routes';
import { createGameRouter } from './routes/game.routes';
import { createReviewRouter } from './routes/review.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', createAuthRouter(pool));
app.use('/api/games', createGameRouter(pool));
app.use('/api/reviews', createReviewRouter(pool));
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gran Turismo API is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Gran Turismo API running on port ${PORT}`);
});

export default app;
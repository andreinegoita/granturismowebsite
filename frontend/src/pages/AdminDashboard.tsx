import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import type { Game } from '../types';
import { GameForm } from '../components/GameForm';
import '../styles/AdminDashboard.css';

interface RawGameData {
  id: number;
  title: string;
  release_year?: number;
  releaseYear?: number;
  platform: string;
  description: string;
  image_urls?: string[];
  imageUrls?: string[];
  rating?: number | string;
}

export const AdminDashboard: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const [stats, setStats] = useState({ totalGames: 0, totalReviews: 0, avgRating: 0 });

  const calculateStats = (data: Game[]) => {
    const totalGames = data.length;
    const totalRatingSum = data.reduce((acc, game) => acc + (game.rating || 0), 0);
    const avgRating = totalGames > 0 ? totalRatingSum / totalGames : 0;

    setStats({
      totalGames,
      totalReviews: 0,
      avgRating
    });
  };

  const loadGames = async () => {
    try {
      const response = await gameService.getAll();

      const formattedData: Game[] = response.data.map((item: RawGameData) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        description: item.description,
        releaseYear: item.release_year ?? item.releaseYear ?? 0,
        imageUrls: item.image_urls ?? item.imageUrls ?? [],
        rating: item.rating ? Number(item.rating) : 0
      }));

      setGames(formattedData);
      calculateStats(formattedData);

    } catch (error) {
      console.error("Failed to load games", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadGames();
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await gameService.delete(id);
        loadGames();
      } catch (err) {
        console.error('Failed to delete game', err);
        alert('Failed to delete game');
      }
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGame(null);
  };

  const handleSaveForm = () => {
    loadGames();
    handleCloseForm();
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="add-btn">
          ➕ Add New Game
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p className="stat-value">{stats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Rating</h3>
          <p className="stat-value">⭐ {stats.avgRating.toFixed(1)}</p>
        </div>
      </div>

      {showForm && (
        <GameForm
          key={editingGame ? editingGame.id : 'new'}
          game={editingGame}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}

      <div className="games-table-wrapper">
        <table className="games-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Year</th>
              <th>Platform</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>
                  {game.imageUrls && game.imageUrls.length > 0 ? (
                    <img src={game.imageUrls[0]} alt="cover" className="table-thumb"/>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#777' }}>No img</span>
                  )}
                </td>
                <td>{game.title}</td>
                <td>{game.releaseYear}</td>
                <td>{game.platform}</td>
                <td>⭐ {game.rating ? game.rating.toFixed(1) : '0.0'}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(game)} className="edit-btn" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(game.id!)} className="delete-btn" title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

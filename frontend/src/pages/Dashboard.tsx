import React, { useEffect, useState } from 'react';
import { progressService } from '../services/api';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

interface Stats {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  licenses: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cars: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tracks: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  achievements: any;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentProgress, setRecentProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, progressRes] = await Promise.all([
        progressService.getStats(),
        progressService.getUserProgress()
      ]);
      
      setStats(statsRes.data);
      setRecentProgress(progressRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>👋 Welcome back, {user?.username}!</h1>
        <p>Your Gran Turismo Journey</p>
      </header>

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card games">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <h3>Games Started</h3>
                <p className="stat-value">{stats.progress.games_started || 0}</p>
                <span className="stat-label">
                  {Math.round(stats.progress.avg_completion || 0)}% avg completion
                </span>
              </div>
            </div>

            <div className="stat-card races">
              <div className="stat-icon">🏁</div>
              <div className="stat-content">
                <h3>Total Races</h3>
                <p className="stat-value">{stats.progress.total_races || 0}</p>
                <span className="stat-label">
                  {stats.progress.total_wins || 0} wins (
                  {stats.progress.total_races > 0 
                    ? Math.round((stats.progress.total_wins / stats.progress.total_races) * 100)
                    : 0}%)
                </span>
              </div>
            </div>

            <div className="stat-card licenses">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>Licenses</h3>
                <p className="stat-value">{stats.licenses.total_licenses || 0}</p>
                <div className="license-breakdown">
                  <span className="gold">🥇 {stats.licenses.gold_count || 0}</span>
                  <span className="silver">🥈 {stats.licenses.silver_count || 0}</span>
                  <span className="bronze">🥉 {stats.licenses.bronze_count || 0}</span>
                </div>
              </div>
            </div>

            <div className="stat-card cars">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>Car Collection</h3>
                <p className="stat-value">{stats.cars.total_cars || 0}</p>
                <span className="stat-label">
                  {Math.round(stats.cars.total_mileage || 0)} km driven
                </span>
              </div>
            </div>

            <div className="stat-card tracks">
              <div className="stat-icon">🏁</div>
              <div className="stat-content">
                <h3>Track Records</h3>
                <p className="stat-value">{stats.tracks.tracks_mastered || 0}</p>
                <span className="stat-label">tracks mastered</span>
              </div>
            </div>

            <div className="stat-card achievements">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Achievements</h3>
                <p className="stat-value">{stats.achievements.unlocked_count || 0}</p>
                <span className="stat-label">
                  {stats.achievements.total_points || 0} points
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <section className="recent-progress">
              <h2>🎮 Recent Progress</h2>
              {recentProgress.length === 0 ? (
                <p className="empty-state">No games started yet. Start playing!</p>
              ) : (
                <div className="progress-list">
                  {recentProgress.map((progress) => (
                    <Link 
                      key={progress.id} 
                      to={`/progress/${progress.game_id}`}
                      className="progress-item"
                    >
                      <div className="progress-game-info">
                        <h3>{progress.game_title}</h3>
                        <div className="progress-stats">
                          <span>🏁 {progress.total_races} races</span>
                          <span>⏱️ {Math.round(progress.hours_played)}h</span>
                          <span>💰 {progress.credits_earned.toLocaleString()} cr</span>
                        </div>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar"
                          style={{ width: `${progress.completion_percentage}%` }}
                        />
                        <span className="progress-percentage">
                          {Math.round(progress.completion_percentage)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="quick-actions">
              <h2>⚡ Quick Actions</h2>
              <div className="action-buttons">
                <Link to="/licenses" className="action-btn licenses-btn">
                  <span className="action-icon">🏆</span>
                  <span>My Licenses</span>
                </Link>
                <Link to="/garage" className="action-btn garage-btn">
                  <span className="action-icon">🚗</span>
                  <span>My Garage</span>
                </Link>
                <Link to="/tracks" className="action-btn tracks-btn">
                  <span className="action-icon">🏁</span>
                  <span>Track Records</span>
                </Link>
                <Link to="/achievements" className="action-btn achievements-btn">
                  <span className="action-icon">🎯</span>
                  <span>Achievements</span>
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
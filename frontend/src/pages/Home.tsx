import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { gameService } from "../services/api";
import type { Game } from "../types";
import { Carousel } from "../components/Carousel";
import { SearchFilter, type FilterOptions } from "../components/SearchFilter";
import "../styles/Home.css";

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

export const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGames = async () => {
    try {
      const response = await gameService.getAll();

      const formattedData: Game[] = response.data.map((item: RawGameData) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        description: item.description,
        releaseYear: item.release_year ?? item.releaseYear ?? 0,

        imageUrls: Array.isArray(item.image_urls)
          ? item.image_urls
          : Array.isArray(item.imageUrls)
          ? item.imageUrls
          : [],

        rating: item.rating ? Number(item.rating) : undefined,
      }));

      console.log("Date formatate corect:", formattedData);

      setGames(formattedData);
      setFilteredGames(formattedData);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleFilterChange = useCallback(
    (filters: FilterOptions) => {
      if (games.length === 0) return;

      let result = [...games];

      if (filters.search) {
        const term = filters.search.toLowerCase().trim();
        result = result.filter((game) =>
          (game.title || "").toLowerCase().includes(term)
        );
      }

      if (filters.platform !== "all") {
        result = result.filter(
          (game) => game.platform && game.platform === filters.platform
        );
      }

      result = result.filter((game) => {
        const year = Number(game.releaseYear);
        return (
          !isNaN(year) && year >= filters.minYear && year <= filters.maxYear
        );
      });

      result = result.filter((game) => {
        const rating = Number(game.rating || 0);
        return rating >= filters.minRating;
      });

      result.sort((a, b) => {
        const ratingA = Number(a.rating || 0);
        const ratingB = Number(b.rating || 0);
        const yearA = Number(a.releaseYear || 0);
        const yearB = Number(b.releaseYear || 0);

        switch (filters.sortBy) {
          case "year":
            return yearB - yearA;
          case "rating":
            return ratingB - ratingA;
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          default:
            return 0;
        }
      });

      setFilteredGames(result);
    },
    [games]
  );

  if (loading) return <div className="loading">Loading games...</div>;

  return (
    <div className="home">
      <header className="hero">
        <h1>🏎️ Gran Turismo Series</h1>
        <p>The Real Driving Simulator - From GT1 to GT7</p>
      </header>

      <div className="search-section">
        <SearchFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <h2>{game.title}</h2>

              <div className="card-meta">
                <span className="year">
                  {game.releaseYear} • {game.platform}
                </span>
                {(game.rating || 0) > 0 && (
                  <span className="card-rating">
                    ⭐ {Number(game.rating).toFixed(1)}
                  </span>
                )}
              </div>

              {game.imageUrls && game.imageUrls.length > 0 && (
                <div className="card-carousel-wrapper">
                  <Carousel images={game.imageUrls} />
                </div>
              )}

              <p className="description">
                {game.description.length > 100
                  ? `${game.description.substring(0, 100)}...`
                  : game.description}
              </p>

              <Link to={`/games/${game.id}`} className="details-link">
                View Details →
              </Link>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No games found matching your filters. 🏁</h3>
            <p>Try adjusting the year range, platform, or search term.</p>
            <button
              className="reset-btn"
              onClick={() => window.location.reload()}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#e53935",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import { Pool } from "pg";
import { Game } from "../models/Game";
import { BaseRepository } from "./BaseRepository";

export class GameRepository extends BaseRepository<Game> {
  constructor(pool: Pool) {
    super(pool, "games");
  }

  async findAll(): Promise<Game[]> {
    const result = await this.pool.query(
      "SELECT * FROM games ORDER BY release_year ASC"
    );
    return result.rows.map((row) => ({
      ...row,
      imageUrls:
        typeof row.image_urls === "string"
          ? JSON.parse(row.image_urls)
          : row.image_urls,
    }));
  }

  async findById(id: number): Promise<Game | null> {
    const result = await this.pool.query("SELECT * FROM games WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      imageUrls:
        typeof row.image_urls === "string"
          ? JSON.parse(row.image_urls)
          : row.image_urls,
    };
  }

  async create(game: Game): Promise<Game> {
    const result = await this.pool.query(
      "INSERT INTO games (title, release_year, platform, description, image_urls) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        game.title,
        game.releaseYear,
        game.platform,
        game.description,
        JSON.stringify(game.imageUrls),
      ]
    );
    return result.rows[0];
  }

  async update(id: number, game: Partial<Game>): Promise<Game | null> {
    const fields = Object.keys(game)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(", ");
    const values = Object.values(game);

    if (fields.length === 0) return null;

    const result = await this.pool.query(
      `UPDATE games SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

}

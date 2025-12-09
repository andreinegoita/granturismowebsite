import React, { useState } from 'react'; 
import { gameService } from '../services/api';
import type { Game } from '../types';
import '../styles/GameForm.css';

interface GameFormProps {
  game: Game | null;
  onClose: () => void;
  onSave: () => void;
}

interface GamePayload {
  title: string;
  release_year: number;
  platform: string;
  description: string;
  image_urls: string[];
  rating?: number;
}

export const GameForm: React.FC<GameFormProps> = ({ game, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Game>>({
    title: game?.title || '',
    releaseYear: game?.releaseYear || 2022,
    platform: game?.platform || 'PlayStation 5',
    description: game?.description || '',
    imageUrls: game?.imageUrls || []
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' ? Number(value) : value
    }));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), imageUrlInput]
      }));
      setImageUrlInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: GamePayload = {
          title: formData.title || '',
          release_year: Number(formData.releaseYear),
          platform: formData.platform || 'PlayStation 5',
          description: formData.description || '',
          image_urls: formData.imageUrls || [],
          rating: game?.rating 
      };

      if (game && game.id) {
        await gameService.update(game.id, payload as unknown as Game);
      } else {
        await gameService.create(payload as unknown as Game);
      }
      onSave();
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Error saving game');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{game ? 'Edit Game' : 'Add New Game'}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group row">
            <div>
              <label>Year</label>
              <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} required />
            </div>
            <div>
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange}>
                <option value="PlayStation">PlayStation</option>
                <option value="PlayStation 2">PlayStation 2</option>
                <option value="PlayStation 3">PlayStation 3</option>
                <option value="PlayStation 4">PlayStation 4</option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="PSP">PSP</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="form-group">
            <label>Add Image URL</label>
            <div className="image-input-group">
              <input 
                type="text" 
                value={imageUrlInput} 
                onChange={(e) => setImageUrlInput(e.target.value)} 
                placeholder="https://..."
              />
              <button type="button" onClick={handleAddImage}>Add</button>
            </div>
            <div className="image-preview-list">
               {formData.imageUrls?.map((url, idx) => (
                 <img key={idx} src={url} alt="preview" className="mini-preview" />
               ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save Game</button>
          </div>
        </form>
      </div>
    </div>
  );
};
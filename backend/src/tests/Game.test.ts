import { Game } from '../models/Game';

describe('Game Model', () => {
  test('should create a game with correct properties', () => {
    const game = new Game(
      'Gran Turismo 7',
      2022,
      'PlayStation 5',
      'Test description',
      ['image1.jpg', 'image2.jpg']
    );
    
    expect(game.title).toBe('Gran Turismo 7');
    expect(game.releaseYear).toBe(2022);
    expect(game.platform).toBe('PlayStation 5');
    expect(game.imageUrls).toHaveLength(2);
  });
});
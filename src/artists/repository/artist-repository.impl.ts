import { DbClient } from 'src/db';
import { ArtistRepository } from './artist-repository';
import { ArtistDto } from '../types';

export class ArtistRepositoryImpl implements ArtistRepository {
  private readonly artistStorage: Set<string>;
  constructor(private readonly db: DbClient) {
    this.artistStorage = new Set<string>();
  }
  doesTempArtistHaveTracks(artistId: string) {
    return this.artistStorage.has(artistId);
  }

  saveTempArtists(artistIds: string[]) {
    artistIds.forEach(artistId => this.artistStorage.add(artistId));
  }

  async saveArtistToDb(artist: ArtistDto) {
    const command = `INSERT INTO artists(id,followers,genres,name,popularity) VALUES (
      '${artist.id}',
      ${!!artist.followers ? artist.followers : 0},
      '${artist.genres.replaceAll("'", "''")}',
      '${artist.name.replaceAll("'", "''")}',
      ${artist.popularity});`;
    try {
      await this.db.query(command);
    } catch (error) {
      console.log(`Failed to insert artist to db. ${error} ${JSON.stringify(artist)}`);
    }
  }
}

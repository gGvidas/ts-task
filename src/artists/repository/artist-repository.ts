import { ArtistDto } from '../types';

export interface ArtistRepository {
  doesTempArtistHaveTracks: (artistId: string) => boolean;
  saveTempArtists: (artistIds: string[]) => void;
  saveArtistToDb: (artist: ArtistDto) => Promise<void>;
}

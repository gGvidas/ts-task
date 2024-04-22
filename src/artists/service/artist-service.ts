export interface ArtistService {
  transformArtists: () => Promise<void>;
  saveArtistsToDb: () => Promise<void>;
}

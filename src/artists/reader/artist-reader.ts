import { Stream } from 'stream';

export interface ArtistReader {
  getRemoteArtistReadStream: () => Promise<Stream>;
  getArtistReadStream: () => Stream;
}

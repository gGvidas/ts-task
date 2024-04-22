import { Transform } from 'stream';

export interface ArtistWriter {
  writeArtists: (stream: Transform) => Promise<any>;
}

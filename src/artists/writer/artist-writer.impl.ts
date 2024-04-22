import { Transform } from 'stream';
import { ArtistWriter } from './artist-writer';
import { FileStorage } from 'src/file-storage';

export class ArtistWriterImpl implements ArtistWriter {
  constructor(private readonly fileStorage: FileStorage) {}
  writeArtists(stream: Transform) {
    try {
      return this.fileStorage.uploadStream('artists.csv', stream);
    } catch (error) {
      console.log('Unable to write artists to artists.csv');
      throw error;
    }
  }
}

import { createReadStream } from 'fs';
import { ArtistReader } from './artist-reader';
import { FileStorage } from 'src/file-storage';

export class ArtistReaderImpl implements ArtistReader {
  constructor(private readonly fileStorage: FileStorage) {}

  getRemoteArtistReadStream() {
    try {
      return this.fileStorage.receiveStream('artists.csv');
    } catch (error) {
      console.log('Unable to read artists from artists.csv');
      throw error;
    }
  }

  getArtistReadStream() {
    try {
      return createReadStream('data/artists.csv');
    } catch (error) {
      console.log('Unable to read artists from data/artists.csv');
      throw error;
    }
  }
}

import { TrackWriter } from './track-writer';
import { FileStorage } from 'src/file-storage';
import { Stream, Transform } from 'stream';

export class TrackWriterImpl implements TrackWriter {
  constructor(private readonly fileStorage: FileStorage) {}

  writeTracks(stream: Transform) {
    try {
      return this.fileStorage.uploadStream('tracks.csv', stream);
    } catch (error) {
      console.log('Unable to write tracks to tracks.csv');
      throw error;
    }
  }
}

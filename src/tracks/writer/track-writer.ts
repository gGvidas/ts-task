import { Transform } from 'stream';

export interface TrackWriter {
  writeTracks: (stream: Transform) => Promise<any>;
}

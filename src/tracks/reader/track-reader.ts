import { ReadStream } from 'fs';
import { Track, TrackDto } from '../types';
import { Stream } from 'stream';

export interface TrackReader {
  getRemoteTrackReadStream: () => Promise<Stream>;
  getTrackReadStream: () => ReadStream;
  parseTrack: (track: TrackDto) => Track;
}

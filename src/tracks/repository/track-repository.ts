import { Track } from '../types';

export interface TrackRepository {
  saveTrackToDb: (track: Track) => Promise<void>;
}

export interface TrackService {
  transformTracks: () => Promise<void>;
  saveTracksToDb: () => Promise<void>;
}

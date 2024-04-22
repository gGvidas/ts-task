import { createReadStream } from 'fs';
import { TrackReader } from './track-reader';
import { Danceability, Track, TrackDto } from '../types';
import JSON5 from 'json5';
import { FileStorage } from 'src/file-storage';

export class TrackReaderImpl implements TrackReader {
  constructor(private readonly fileStorage: FileStorage) {}

  getRemoteTrackReadStream() {
    try {
      return this.fileStorage.receiveStream('tracks.csv');
    } catch (error) {
      console.log('Unable to read tracks from tracks.csv');
      throw error;
    }
  }

  getTrackReadStream() {
    try {
      return createReadStream('data/tracks.csv');
    } catch (error) {
      console.log('Unable to read tracks from data/tracks.csv');
      throw error;
    }
  }

  parseTrack(track: TrackDto): Track {
    try {
      const releaseDate = new Date(track.release_date);

      return {
        id: track.id,
        name: track.name,
        popularity: track.popularity,
        explicit: track.explicit,
        artists: track.artists,
        energy: track.energy,
        key: track.key,
        loudness: track.loudness,
        mode: track.mode,
        speechiness: track.speechiness,
        acousticness: track.acousticness,
        instrumentalness: track.instrumentalness,
        liveness: track.liveness,
        valence: track.valence,
        tempo: track.tempo,
        time_signature: track.time_signature,
        danceability: this.mapDanceabality(Number(track.danceability)),
        release_year: releaseDate.getFullYear(),
        release_month: releaseDate.getMonth() + 1,
        release_day: releaseDate.getDate(),
        duration_ms: Number(track.duration_ms),
        id_artists: this.parseArtistIds(track.id_artists),
      };
    } catch (error) {
      throw Error(`Failed to parse track: ${track}. ${error}`);
    }
  }

  private mapDanceabality(danceabilityRatio: number): Danceability {
    if (danceabilityRatio >= 0 && danceabilityRatio < 0.5) {
      return 'Low';
    } else if (danceabilityRatio >= 0.5 && danceabilityRatio <= 0.6) {
      return 'Medium';
    } else if (danceabilityRatio > 0.6 && danceabilityRatio <= 1) {
      return 'High';
    }

    return 'Other';
  }

  private parseArtistIds(artistIds: string): string[] {
    try {
      const parsedValue = JSON5.parse(artistIds);

      return parsedValue;
    } catch (error) {
      throw Error(`Failed to parse artist ids from: ${artistIds}`);
    }
  }
}

import { DbClient } from 'src/db';
import { TrackRepository } from './track-repository';
import { Track } from '../types';
import JSON5 from 'json5';

export class TrackRepositoryImpl implements TrackRepository {
  constructor(private readonly db: DbClient) {}

  async saveTrackToDb(track: Track) {
    const trackCommand = this.getInsertTrackCommand(track);
    const trackArtistsCommands = this.getInsertTrackArtistCommands(track);
    try {
      await this.db.query(trackCommand);
    } catch (error) {
      console.log(`Failed to insert track. ${error} ${JSON.stringify(track)}`);
    }

    try {
      await Promise.all([...trackArtistsCommands.map(command => this.db.query(command))]);
    } catch (error) {
      console.log(`Failed to insert track artist to db. ${error} ${track.id_artists}`);
    }
  }

  private getInsertTrackCommand(track: Track) {
    return `INSERT INTO tracks(
        id,
        name,
        popularity,
        duration_ms,
        explicit,
        release_year,
        release_month,
        release_day,
        danceability,
        energy,
        key,
        loudness,
        mode,
        speechiness,
        acousticness,
        instrumentalness,
        liveness,
        valence,
        tempo,
        time_signature
    ) VALUES (
        '${track.id}',
        '${track.name.replaceAll("'", "''")}',
        ${track.popularity},
        ${track.duration_ms},
        ${Boolean(Number(track.explicit))},
        ${track.release_year},
        ${track.release_month},
        ${track.release_day},
        '${track.danceability}',
        ${track.energy},
        ${track.key},
        ${track.loudness},
        ${track.mode},
        ${track.speechiness},
        ${track.acousticness},
        ${track.instrumentalness},
        ${track.liveness},
        ${track.valence},
        ${track.tempo},
        ${track.time_signature}
    );
    `;
  }

  private getInsertTrackArtistCommands(track: Track) {
    const artists: string[] =
      typeof track.id_artists === 'string' ? JSON5.parse(track.id_artists) : track.id_artists;
    return artists.map(
      artist => `INSERT INTO trackartists(track_id, artist_id) VALUES (
        '${track.id}',
        '${artist}'
    );`,
    );
  }
}

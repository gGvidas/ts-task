import { TrackReader } from '../reader/track-reader';
import { TrackService } from './track-service';
import { TrackWriter } from '../writer/track-writer';
import { ArtistRepository } from 'src/artists/repository/artist-repository';
import csvParser from 'csv-parser';
import { Track, TrackDto } from '../types';
import { parse, stringify, transform } from 'csv';
import { TrackRepository } from '../repository';

export class TrackServiceImpl implements TrackService {
  constructor(
    private readonly trackReader: TrackReader,
    private readonly trackWriter: TrackWriter,
    private readonly artistRepository: ArtistRepository,
    private readonly trackRepository: TrackRepository,
  ) {}

  async transformTracks() {
    const trackReadStream = this.trackReader.getTrackReadStream();

    const csvTransformer = transform(
      (data: TrackDto, callback: (error?: Error, data?: Track) => void) => {
        try {
          const track = this.trackReader.parseTrack(data);

          if (track.name && track.duration_ms >= 60000) {
            this.artistRepository.saveTempArtists(track.id_artists);
            callback(null, track);
            return;
          }
          callback();
        } catch (error) {
          console.log('message' in error ? error.message : error);
          callback();
        }
      },
    );

    await this.trackWriter.writeTracks(
      trackReadStream
        .pipe(csvParser())
        .pipe(csvTransformer)
        .pipe(stringify({ header: true })),
    );
  }

  async saveTracksToDb() {
    const readStream = await this.trackReader.getRemoteTrackReadStream();

    const csvTransformer = transform(
      async (data: Track, callback: (error?: Error, data?: Track) => void) => {
        try {
          await this.trackRepository.saveTrackToDb(data);
          callback();
        } catch (error) {
          console.log('message' in error ? error.message : error);
          callback();
        }
      },
    );

    return new Promise<void>((resolve, reject) => {
      readStream
        .pipe(csvParser())
        .pipe(csvTransformer)
        .on('finish', () => resolve())
        .on('error', err => reject(err));
    });
  }
}

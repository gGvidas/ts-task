import { ArtistReader } from '../reader/artist-reader';
import { ArtistService } from './artist-service';
import { ArtistWriter } from '../writer/artist-writer';
import { ArtistRepository } from '../repository/artist-repository';
import csvParser from 'csv-parser';
import { ArtistDto } from '../types';
import { stringify, transform } from 'csv';

export class ArtistServiceImpl implements ArtistService {
  constructor(
    private readonly artistReader: ArtistReader,
    private readonly artistWriter: ArtistWriter,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async transformArtists() {
    const artistReadStream = this.artistReader.getArtistReadStream();

    const csvTransformer = transform(
      (data: ArtistDto, callback: (error?: Error | null, data?: ArtistDto) => void) => {
        try {
          if (this.artistRepository.doesTempArtistHaveTracks(data.id)) {
            callback(null, data);
            return;
          }
          callback();
        } catch (error) {
          console.log('message' in error ? error.message : error);
          callback();
        }
      },
    );

    await this.artistWriter.writeArtists(
      artistReadStream
        .pipe(csvParser())
        .pipe(csvTransformer)
        .pipe(stringify({ header: true })),
    );
  }

  async saveArtistsToDb() {
    const readStream = await this.artistReader.getRemoteArtistReadStream();

    const csvTransformer = transform(
      async (data: ArtistDto, callback: (error?: Error | null, data?: ArtistDto) => void) => {
        try {
          await this.artistRepository.saveArtistToDb(data);
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

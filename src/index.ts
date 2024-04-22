import { ArtistServiceImpl } from './artists/service/artist-service.impl';
import { ArtistWriterImpl } from './artists/writer';
import { ArtistRepositoryImpl } from './artists/repository';
import { TrackServiceImpl } from './tracks/service/track-service.impl';
import { TrackReaderImpl } from './tracks';
import { TrackWriterImpl } from './tracks/writer';
import { S3FileStorage } from './file-storage';
import { ArtistReaderImpl } from './artists';
import { DbClient } from './db';
import { TrackRepositoryImpl } from './tracks/repository';

async function main() {
  const dbClient = new DbClient();
  const artistRepository = new ArtistRepositoryImpl(dbClient);
  const trackRepository = new TrackRepositoryImpl(dbClient);
  const s3Client = new S3FileStorage();

  const trackService = new TrackServiceImpl(
    new TrackReaderImpl(s3Client),
    new TrackWriterImpl(s3Client),
    artistRepository,
    trackRepository,
  );

  const artistService = new ArtistServiceImpl(
    new ArtistReaderImpl(s3Client),
    new ArtistWriterImpl(s3Client),
    artistRepository,
  );

  await trackService.transformTracks();
  await artistService.transformArtists();

  dbClient.disconnect();
}

main();

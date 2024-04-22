import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { FileStorage } from './file-storage';
import { Readable, Stream, Transform } from 'stream';

export class S3FileStorage implements FileStorage {
  private readonly client: S3Client;
  constructor() {
    this.client = new S3Client({
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
      },
      endpoint: 'http://localhost:4569',
      region: 'us-east-1',
    });
  }

  async uploadStream(filename: string, stream: Transform) {
    const Key = filename;
    const Bucket = 'local-bucket';

    try {
      const parallelUploads3 = new Upload({
        client: this.client,
        params: {
          Bucket,
          Key,
          Body: stream,
          ACL: 'public-read',
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      return parallelUploads3.done();
    } catch (e) {
      throw new Error(`Upload to s3 failed. ${e}`);
    }
  }

  async receiveStream(filename: string): Promise<Stream> {
    const Key = filename;
    const Bucket = 'local-bucket';

    try {
      const command = new GetObjectCommand({
        Bucket,
        Key,
      });
      const item = await this.client.send(command);
      return item.Body as Readable;
    } catch (e) {
      throw new Error(`Read from s3 failed. ${e}`);
    }
  }
}

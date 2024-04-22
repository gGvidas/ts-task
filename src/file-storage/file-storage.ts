import { Stream, Transform } from 'stream';

export interface FileStorage {
  uploadStream: (filename: string, stream: Transform) => Promise<any>;
  receiveStream: (filename: string) => Promise<Stream>;
}

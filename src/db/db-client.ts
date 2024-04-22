import pg from 'pg';

export class DbClient {
  private readonly client: pg.Client;
  constructor() {
    this.client = new pg.Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'pass',
      database: 'postgres',
    });
    this.client.connect();
  }

  async query(query: string) {
    await this.client.query(query);
  }

  async disconnect() {
    this.client.end();
  }
}

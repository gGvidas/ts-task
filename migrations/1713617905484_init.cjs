/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE Artists (
        id char(22) primary key,
        followers int,
        genres text,
        name varchar(256),
        popularity int
    );
    
    CREATE TYPE danceability AS ENUM ('Other', 'Low', 'Medium', 'High');
    
    CREATE TABLE Tracks (
        id char(22) primary key,
        name varchar(1024),
        popularity int,
        duration_ms int,
        explicit boolean,
        release_year int,
        release_month int,
        release_day int,
        danceability danceability,
        energy real,
        key real,
        loudness real,
        mode real,
        speechiness real,
        acousticness real,
        instrumentalness real,
        liveness real,
        valence real,
        tempo real,
        time_signature real
    );
    
    CREATE TABLE TrackArtists (
        track_id char(22) REFERENCES Tracks(id),
        artist_id char(22) REFERENCES Artists(id),
        CONSTRAINT track_artists_pk PRIMARY KEY(track_id,artist_id)
    );

    CREATE VIEW TrackDetails AS SELECT
        t.id,
        t.name,
        t.popularity,
        t.energy,
        t.danceability,
        sum(a.followers) AS artistFollowers
    FROM ((tracks t
        JOIN trackartists ta ON ((ta.track_id = t.id)))
        JOIN artists a ON ((ta.artist_id = a.id)))
    GROUP BY t.id;

    CREATE VIEW TracksWithArtistFollowers as SELECT
        t.* 
    FROM artists a
        JOIN trackartists ta ON ta.artist_id = a.id
        JOIN tracks t ON ta.track_id = t.id
    WHERE a.followers > 0
    GROUP BY t.id;

    CREATE VIEW MostEnergisingTracksPerYear AS SELECT
    DISTINCT ON (t.release_year)
        t.*
    FROM tracks t
    ORDER BY t.release_year, t.energy DESC;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};

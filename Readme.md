## Missing improvements

Due to lack of time these improvements are missing:

1. Unit tests
   - Reader:
     - Mock dependencies, and check that both methods call functions with correct arguments, correctly handle incoming errors
     - Test parsing function, how it handles errors and that it correctly parses data with various inputs
   - Writer:
     - Mock dependencies, and check that functions are called with correct arguments, correctly handle incoming errors
   - S3FileStorage:
     - Mock S3 sdk, test that functions are called with correct parameters and error handling
   - DbClient:
     - Mock postgresql client, test that correct functions are called
   - Artist service:
     - Mock dependencies and file data
     - transformArtists: test that reader and writer are called, artist repository is called to check if artist has tracks, and depending on the result, transformer passes correct data, and that it passes data on result, and error handling
     - saveArtistsToDb: test that reader is called, artist repository is called and correctly handles errors, and promise resolve reject on finish and on error
   - Tracks service:
     - Mock dependencies and file data
     - transformTracks: test that reader and writer are called, reader is called to parse dto data, and depending on filter transformer passes correct data and temporarily saves artist ids, and error handling
     - saveTracksToDb: test that reader is called, repository is called and correctly handles errors, and promise resolve reject on finish and on error
   - Tracks repository:
     - Mock db client, test that correct query is called for tracks and for track's artists, error handling
   - Artists repository:
     - Mock db client, test that correct query is called, error handling
2. Better error handling (e.g. better user information in all places, handling non-existant files, etc.)
3. SQL insert query improvements - would have to look into the best way to do this, but from some light searching - COPY command or batching records and inserting the whole batch at once seem better solutions that the current one.
4. s3hook as a lambda that is called on s3:ObjectCreated:\* event, instead of manual invocation (prerequisite is step 3, with current performance using a lambda for this doesn't seem optimal)
5. Better data cleanup (e.g. genres field next to artist parsed into a proper array and inserted into a separate sql table, common string cleanup before inserting to db) and mapping when fetching data from s3
6. Using env variables for database/s3 connection for deployment to cloud
7. Cleaner dependency injection, instead of doing everything manually by hand in entry points

## Prerequisites

1. [Node 20.x](https://nodejs.org/en/download)
2. [Yarn](https://classic.yarnpkg.com/en/docs/install)
3. [Docker-compose](https://docs.docker.com/compose/install/)

## Running

1. Run `yarn install` to install dependencies
2. Run `yarn docker` to run docker-compose
3. Run `yarn migrate` to create db migrations
4. Run `yarn sls` to start serverless offline service (keep this running and continue in another terminal window). `s3/local-bucket` empty folder should have been created at root of the project.
5. Run `yarn start` to start the data transformation and saving to s3 script. `s3/local-bucket` should have been populated with tracks and artists objects at this point.
6. Run `yarn start-s3hook` to start the saving to db script.

//let connectionString = process.platform === 'win32' ? 'postgres://postgres:root@localhost/learningVocabulary' : 'postgres://localhost/forum'

module.exports = {
  development: {
    client: 'pg',
    connection: {
      // host : '127.0.0.1',
      host: "localhost",
      // user : 'postgres',
      // password : 'postgrespassword',
      database : 'learningVocabulary'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds/production',
    },
  },
};

module.exports = {
  development: {
      client: 'pg',
      connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'postgrespassword',
        database : 'postgres'
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

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  entities: ['dist/src/entity/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'dist/src/entity',
    migrationsDir: 'dist/src/migration',
    subscribersDir: 'dist/src/subscriber',
  },
};

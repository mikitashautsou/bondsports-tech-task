export interface IENV {
  APP_PORT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

let ENV: IENV;
if (process.env.NODE_ENV === 'local') {
  ENV = {
    APP_PORT: '4000',
    DB_HOST: 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT),
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'test',
    DB_DATABASE: 'bondsports',
  };
} else {
  ENV = {
    APP_PORT: process.env.PORT as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: parseInt(process.env.DB_PORT),
    DB_USERNAME: process.env.DB_USERNAME as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_DATABASE: process.env.DB_DATABASE as string,
  };
}

export { ENV };

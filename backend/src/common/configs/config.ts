import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: Number.parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST || 'localhost',
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1',
    path: 'api',
  },
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  redis: {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number.parseInt(process.env.REDIS_PORT, 10) || 6379,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DATABASE: process.env.REDIS_DATABASE,
    REDIS_KEY_PREFIX: process.env.REDIS_KEY_PREFIX,
  },
};

export default (): Config => config;

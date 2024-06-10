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
};

export default (): Config => config;

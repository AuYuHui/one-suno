export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  jwt: SecurityConfig;
  redis: ReidsConfig;
}

export interface NestConfig {
  port: number;
  host: string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  JWT_SECRET: string;
}

export interface ReidsConfig {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  REDIS_DATABASE: string;
  REDIS_KEY_PREFIX: string;
}

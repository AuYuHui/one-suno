declare namespace NodeJS {
  interface ProcessEnv {
    /** The environment in which the application is running. */
    NODE_ENV: 'development' | 'production';
    /** The host on which the application should listen. */
    APP_HOST: string;
    /** The port on which the application should listen. */
    APP_PORT: string;
    /** The name of the application. */
    APP_NAME: string;
    /** The database host. */
    MYSQL_HOST: string;
    /** The database port. */
    MYSQL_PORT: string;
    /** The database user. */
    MYSQL_USER: string;
    /** The database password. */
    MYSQL_PASSWORD: string;
    /** The database name. */
    MYSQL_DATABASE: string;
    /** The secret used to sign JWT tokens. */
    JWT_SECRET: string;
  }
}

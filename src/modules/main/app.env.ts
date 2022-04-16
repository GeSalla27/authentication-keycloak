import * as dotenv from "dotenv";

dotenv.config();

const env = {
  BASE_PATH: (process.env.BASE_PATH ?? "") as string,
  DB_TYPE: process.env.DB_TYPE as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: parseInt(process.env.DB_PORT ?? "5432", 10),
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_DATABASE: process.env.DB_DATABASE as string,
  DB_SSL: process.env.DB_SSL === "true",
  DB_SSL_IGNORE_SERVER_IDENTITY:
    process.env.DB_SSL_IGNORE_SERVER_IDENTITY === "true",
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN ?? "1", 10),
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX ?? "1", 10),
  LOG_CONSOLE_LEVEL: process.env.LOG_CONSOLE_LEVEL as string,
  LOG_FILE_ACTIVE: process.env.LOG_FILE_ACTIVE === "true",
  LOG_FILE_LEVEL: process.env.LOG_FILE_LEVEL as string,
  LOG_FILE_NAME: process.env.LOG_FILE_NAME as string,
  KEYCLOAK_AUTH_SERVER_URL: process.env.KEYCLOAK_AUTH_SERVER_URL as string,
  REALM_NAME: process.env.REALM_NAME as string,
  CLIENT_ID_ADMIN: process.env.CLIENT_ID_ADMIN as string,
  SECRET_ADMIN: process.env.SECRET_ADMIN as string,
  CLIENT_ID_USER: process.env.CLIENT_ID_USER as string,
  SECRET_USER: process.env.SECRET_USER as string,
};

export default Object.freeze(env);

import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';

config();

export const typeOrmConfigs = () => {
  const obj: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(<string>process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'mandi_dev',
    logging: process.env.NODE_ENV === 'local' || 'development' ? true : false,

    entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../database/migrations-files/*.{ts,js}')],

    migrationsTableName: 'migrations',
    synchronize: true,
  };
  return obj;
};

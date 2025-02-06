import { DataSource } from 'typeorm';
import { User } from '../auth/user.entity';
import * as dotenv from 'dotenv';
dotenv.config(); // Загружает переменные окружения из .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'dbconverter',
  entities: [User],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

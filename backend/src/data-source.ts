import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// TODO (Sub-Task 5): Import entities here once created
// import { User } from './modules/users/user.entity';
// import { Category } from './modules/categories/category.entity';
// import { Transaction } from './modules/transactions/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'bankcash',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false, // Never true in production — use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/modules/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
  subscribers: [],
});

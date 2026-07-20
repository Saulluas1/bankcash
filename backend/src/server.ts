import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });

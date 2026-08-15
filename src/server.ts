import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT: number = Number(process.env.PORT) || 8000;

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err: Error) => {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

export default app;

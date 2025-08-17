import 'dotenv/config';

process.env.TZ = 'UTC';

import express from 'express'
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app = express();

// cors
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandlerMiddleware);

// inicializacion del servidor y DB
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
.then(() => {
  console.log("DataSource initialized successfully");

  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("Error during DataSource initialization:", err);
});
import mongoose from 'mongoose';
import models from '../models';
import logger from '../utils/logger';
import configsEnv from '../configs/configs.env';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(
      configsEnv.MONGO_URI || 'mongodb://localhost:27017/projects',
      {
        authSource: 'admin',
      }
    );
    logger.info('Connected to MongoDB');
    Object.values(models).forEach((model) => {
      mongoose.model(model.modelName, model.schema);
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
  }
}

export default connectDB;

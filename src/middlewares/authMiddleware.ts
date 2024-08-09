import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument, UserModel } from '../models/User';
import configsEnv from '../configs/configs.env';
import logger from '../utils/logger';

const JWT_SECRET = configsEnv.JWT_SECRET;

interface IUserRequest
  extends Omit<
    Request,
    'setEncoding' | 'pause' | 'resume' | 'unpipe' | 'wrap'
  > {
  user?: UserDocument;
}
export const isAuthenticated = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = (await UserModel.findById(decoded.id)) as UserDocument;
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

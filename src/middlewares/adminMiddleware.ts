import { Request, Response, NextFunction } from 'express';
import { UserDocument, UserRole } from '../models/User';

interface IUserRequest
  extends Omit<
    Request,
    'setEncoding' | 'pause' | 'resume' | 'unpipe' | 'wrap'
  > {
  user?: UserDocument;
}

export const isAdmin = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === UserRole.admin) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

import { Request, Response } from 'express';
import { userService } from '../services';
import logger from '../utils/logger';
import { CreateUserResponse, LoginUserResponse } from 'userTypes';

class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error fetching users:', error.message);
        res.status(500).json({ error: error.message });
      } else {
        logger.error('An unknown error occurred while fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email and password are required' });
      }

      const { user, accessToken, refreshToken } = (await userService.createUser(
        req.body
      )) as CreateUserResponse;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(201).json({ user, accessToken });
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error creating user:', error.message);
        res.status(500).json({ error: error.message });
      } else {
        logger.error('An unknown error occurred while creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  public async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email and password are required' });
      }

      const { user, accessToken, refreshToken } = (await userService.loginUser(
        email,
        password
      )) as LoginUserResponse;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ user, accessToken });
    } catch (error) {
      logger.error('Error logging in user:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateTokens(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ error: 'User ID and refresh token are required' });
      }

      const { accessToken } = (await userService.updateTokens(
        refreshToken
      )) as { accessToken: string };
      res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error updating tokens:', error.message);
        res.status(500).json({ error: error.message });
      } else {
        logger.error('An unknown error occurred while updating tokens:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const updatedData = req.body;

      const updatedUser = await userService.updateUser(userId, updatedData);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error updating user:', error.message);
        return res.status(500).json({ error: 'Error updating user' });
      } else {
        logger.error('An unknown error occurred while updating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const deletedUser = await userService.deleteUser(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error deleting user:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        logger.error('An unknown error occurred while deleting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}

export default new UserController();

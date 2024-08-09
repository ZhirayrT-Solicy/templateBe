import jwt from 'jsonwebtoken';
import { UserDocument, UserModel } from '../models/User';
import logger from '../utils/logger';
import configsEnv from '../configs/configs.env';
import {
  CreateUserResponse,
  IGenerateTokensResponse,
  LoginUserResponse,
} from 'userTypes';
import { ErrorResponse } from 'resultTypes';

class UserService {
  private generateTokens(user: UserDocument): IGenerateTokensResponse {
    const accessToken = jwt.sign({ id: user._id }, configsEnv.JWT_SECRET, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      configsEnv.REFRESH_JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  }

  public async getAllUsers(): Promise<UserDocument[]> {
    try {
      return await UserModel.find();
    } catch (error) {
      logger.error('Fetch transactions', error);
    }
  }

  public async createUser(
    userData: UserDocument
  ): Promise<CreateUserResponse | ErrorResponse> {
    try {
      const candidate = await UserModel.findOne({ email: userData.email });
      if (candidate) {
        throw new Error('Duplicate user');
      }
      const user = new UserModel(userData) as UserDocument;
      await user.save();
      const tokens = this.generateTokens(user);
      return { user, ...tokens };
    } catch (error) {
      logger.error('Error creating user', error);
      throw error;
    }
  }

  public async loginUser(
    email: string,
    password: string
  ): Promise<LoginUserResponse | ErrorResponse> {
    try {
      const user = (await UserModel.findOne({ email })) as UserDocument;
      if (!user) throw new Error('User not found');

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error('Invalid credentials');

      const tokens = this.generateTokens(user);
      return { user, ...tokens };
    } catch (error) {
      logger.error('Error logging in user', error);
      throw error;
    }
  }

  public async updateTokens(
    refreshToken: string
  ): Promise<IGenerateTokensResponse | ErrorResponse> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        configsEnv.REFRESH_JWT_SECRET
      ) as { id: string };
      if (!decoded.id) {
        throw new Error('Invalid token');
      }

      const user = (await UserModel.findById(decoded.id)) as UserDocument;
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      logger.error('Error updating tokens', error);
      throw error;
    }
  }

  public async updateUser(
    userId: string,
    updatedData: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findByIdAndUpdate(userId, {
        ...updatedData,
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error('Error updating user', error);
      throw error;
    }
  }

  public async deleteUser(userId: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      logger.error('Error deleting user', error);
      throw error;
    }
  }
}

export default new UserService();

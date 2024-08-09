import { UserDocument } from '../models/User';

export interface IGenerateTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserResponse {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}

export interface LoginUserResponse {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}

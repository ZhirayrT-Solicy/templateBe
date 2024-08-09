import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

class EnvConfig {
  public PORT = process.env.PORT || 8080;
  public MONGO_URI = process.env.MONGO_URI;
  public JWT_SECRET = process.env.JWT_SECRET;
  public REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
  public LOG_LEVEL = process.env.LOG_LEVEL;
  public ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
  public API_URL = process.env.API_URL;
  public ADMIN_USER_EMAIL = process.env.ADMIN_USER_EMAIL;
  public ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD;

  public constructor() {
    this.validateEnv();
  }

  private validateEnv(): void {
    if (!this.MONGO_URI) {
      throw new Error('MONGO_URI is required');
    }
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }
  }
}

const config = new EnvConfig();

export default config;

import express, { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swaggerConfig';
import config from './configs/configs.env';
import logger from './utils/logger';
import router from './routes';
import connectDB from './database/database-connection';
import { createAdminUser } from './utils/createAdmin';

class App {
  public app: Express;
  public port: number;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.listen();
  }

  private connectToDatabase(): void {
    connectDB();
    createAdminUser();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
      })
    );

    this.app.use(cookieParser());

    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    });
    this.app.use(apiLimiter);

    // Body Parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Swagger UI
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeRoutes(): void {
    this.app.use('/api', router);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listening on port ${this.port}`);
    });
  }
}

new App(Number(config.PORT));

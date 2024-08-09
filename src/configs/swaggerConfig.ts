import swaggerJsdoc from 'swagger-jsdoc';
import configsEnv from './configs.env';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for Me ))',
    },
    servers: [
      {
        url: `${configsEnv.API_URL}/api`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
  apis: ['src/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

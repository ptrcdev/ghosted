import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import serverless from 'serverless-http';

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn'] }
    );
    
    app.enableCors();
    app.setGlobalPrefix('api');
    
    await app.init();
    
    cachedApp = serverless(expressApp);
  }
  
  return cachedApp;
}

export default async (req, res) => {
  const app = await bootstrap();
  return app(req, res);
};
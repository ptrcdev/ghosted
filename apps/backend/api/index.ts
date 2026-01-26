import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();
let isAppInitialized = false;

async function initializeApp() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { 
        logger: ['error', 'warn'],
        bufferLogs: true 
      }
    );

    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });

    await app.init();
    isAppInitialized = true;
  }
  
  return server;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const app = await initializeApp();
    app(req as any, res as any);
  } catch (error) {
    console.error('Error initializing app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
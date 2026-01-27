import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VersioningType } from '@nestjs/common';

const server = express();
let isAppInitialized = false;

function getAllowedOrigins() {
  return (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function initializeApp() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      {
        logger: ['error', 'warn'],
        bufferLogs: true,
      }
    );

    const allowed = getAllowedOrigins();

    app.enableCors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl/postman
        if (allowed.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.enableVersioning({ type: VersioningType.URI });

    await app.init();
    isAppInitialized = true;
  }

  return server;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Handle preflight early (super important in serverless)
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    const app = await initializeApp();
    app(req as any, res as any);
  } catch (error) {
    console.error('Error initializing app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

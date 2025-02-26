import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.use(
    session({
      secret: config.get('SESSION_SECRET', 'fallback-secret'),
      resave: false,
      saveUninitialized: true, // Change to true for testing
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false, // Change to `true` if using HTTPS
        sameSite: 'lax', // Helps with cross-origin requests
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4444',
    credentials: true,
  });

  app.use((req, res, next) => {
    next();
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
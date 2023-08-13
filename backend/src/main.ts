import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import firebase from 'firebase-admin';
import { AppModule } from './app/app.module';
import { AuthGuard } from './auth/auth.guard';
import { WEB_URL } from './common/url';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const serviceAccount: firebase.ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });
  firebase.firestore().settings({ ignoreUndefinedProperties: true });

  app.useGlobalGuards(new AuthGuard(app.get(JwtService), app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: WEB_URL,
  });
  await app.listen(process.env.PORT || 8000);
}
bootstrap();

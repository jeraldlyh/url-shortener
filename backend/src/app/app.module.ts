import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { UrlModule } from '../url/url.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AccountModule,
    UrlModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

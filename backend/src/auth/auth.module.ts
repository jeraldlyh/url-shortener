import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { jwtConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AccountModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

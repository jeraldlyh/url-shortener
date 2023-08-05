import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { UrlService } from './url.service';

@Module({
  imports: [JwtModule],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}

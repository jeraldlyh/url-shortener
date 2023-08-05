import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { UrlService } from './url.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}

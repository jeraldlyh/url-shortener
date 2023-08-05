import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { IAuth } from '../auth/auth.types';
import { Url } from './url.model';
import { UrlService } from './url.service';

@Controller('url')
@UseGuards(AuthGuard)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl(@Auth() auth: IAuth, @Body() url: Url): Promise<void> {
    return await this.urlService.createUrl(auth.username, url);
  }
}

import { Body, Controller } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { IAuth } from '../auth/auth.types';
import { Url } from './url.model';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  async createUrl(@Auth() auth: IAuth, @Body() url: Url): Promise<void> {
    return await this.urlService.createUrl(auth.username, url);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { IAuth } from '../auth/auth.types';
import { WEB_URL } from '../common/url';
import { CreateQrCodeDto, IUrl, Url } from './url.model';
import { UrlService } from './url.service';
import { IRedirectUrl } from './url.types';

@Controller('url')
@UseGuards(AuthGuard)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:redirectHash')
  @Redirect()
  async redirect(
    @Param('redirectHash') redirectHash: string,
  ): Promise<IRedirectUrl> {
    const redirectUrl = await this.urlService.getRedirectUrlByHash(
      redirectHash,
    );

    if (!redirectUrl) {
      return { url: `${WEB_URL}/404` };
    }

    return { url: redirectUrl };
  }

  @Get()
  async getAllUrlByUsername(@Auth() auth: IAuth): Promise<IUrl[]> {
    return await this.urlService.getAllUrlByUsername(auth.username);
  }

  @Post()
  async createUrl(@Auth() auth: IAuth, @Body() url: Url): Promise<void> {
    return await this.urlService.createUrl(auth.username, url);
  }

  @Post('/qr')
  async createQrCode(
    @Auth() auth: IAuth,
    @Body() qrCode: CreateQrCodeDto,
  ): Promise<void> {
    return await this.urlService.createQrCode(auth.username, qrCode);
  }

  @Delete('/:redirectHash')
  async deleteUrl(
    @Auth() auth: IAuth,
    @Param('redirectHash') redirectHash: string,
  ): Promise<void> {
    return await this.urlService.deleteUrl(auth.username, redirectHash);
  }
}

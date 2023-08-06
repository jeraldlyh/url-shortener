import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { IAuth } from '../auth/auth.types';
import { CreateQrCodeDto, IUrl, Url } from './url.model';
import { UrlService } from './url.service';

@Controller('url')
@UseGuards(AuthGuard)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:redirectHash')
  @Redirect()
  async redirect(@Param('redirectHash') redirectHash: string) {
    const redirectUrl = await this.urlService.getRedirectUrlByHash(
      redirectHash,
    );

    if (!redirectUrl) {
      return { url: `${process.env.BASE_URL}/404` };
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
}

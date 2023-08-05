import { Body, Controller, Post, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Account } from '../account/account.model';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() account: Account,
    @Response({ passthrough: true }) response: IResponse,
  ) {
    const token = await this.authService.validateUser(account);

    response.cookie('accessToken', token, { httpOnly: true });
  }
}

import { Body, Controller, Post, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Account } from '../account/account.model';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create')
  async createAccount(
    @Body() account: Account,
    @Response({ passthrough: true }) response: IResponse,
  ): Promise<void> {
    const token = await this.authService.createAccount(account);

    response.cookie('accessToken', token, { httpOnly: true });
  }

  @Post('/login')
  async login(
    @Body() account: Account,
    @Response({ passthrough: true }) response: IResponse,
  ): Promise<void> {
    const token = await this.authService.validateUser(account);

    response.cookie('accessToken', token, { httpOnly: true });
  }
}

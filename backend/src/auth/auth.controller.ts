import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Account } from '../account/account.model';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
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

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(
    @Response({ passthrough: true }) response: IResponse,
  ): Promise<void> {
    response.clearCookie('accessToken', { httpOnly: true });
  }
}

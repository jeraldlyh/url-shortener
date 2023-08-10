import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Account } from '../account/account.model';
import { Auth } from './auth.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { IAuth } from './auth.types';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  async signUp(
    @Body() account: Account,
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<string> {
    const token = await this.authService.createAccount(account);

    response.cookie('accessToken', token, { httpOnly: true });
    return account.username;
  }

  @Post('/signIn')
  async signIn(
    @Body() account: Account,
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<string> {
    const token = await this.authService.validateUser(account);

    response.cookie('accessToken', token, { httpOnly: true });
    return account.username;
  }

  @Post('/signOut')
  @UseGuards(AuthGuard)
  async signOut(
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<void> {
    response.clearCookie('accessToken', { httpOnly: true });
  }

  @Post('/validate')
  @UseGuards(AuthGuard)
  async validate(@Auth() auth: IAuth): Promise<boolean> {
    console.log(auth);
    return await this.authService.validateToken(auth.token);
  }
}

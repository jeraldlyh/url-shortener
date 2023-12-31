import { Body, Controller, Post, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Account } from '../account/account.model';
import { Public } from '../common';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';
import { IAuth } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  @Public()
  async signUp(
    @Body() account: Account,
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<string> {
    const token = await this.authService.createAccount(account);

    response.cookie('accessToken', token);
    return token;
  }

  @Post('/signIn')
  @Public()
  async signIn(
    @Body() account: Account,
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<string> {
    const token = await this.authService.validateUser(account);

    response.cookie('accessToken', token);
    return token;
  }

  @Post('/signOut')
  async signOut(
    @Response({ passthrough: true }) response: Partial<IResponse>,
  ): Promise<void> {
    response.clearCookie('accessToken');
  }

  @Post('/validate')
  async validate(@Auth() auth: IAuth): Promise<boolean> {
    console.log(auth);
    return await this.authService.validateToken(auth.token);
  }
}

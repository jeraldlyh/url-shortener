import { Body, Controller, Post } from '@nestjs/common';
import { Account } from '../account/account.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() account: Account) {
    return await this.authService.validateUser(account);
  }
}

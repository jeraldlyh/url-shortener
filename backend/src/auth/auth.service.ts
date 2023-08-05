import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Account } from '../account/account.model';
import { AccountService } from '../account/account.service';
import { IJwtToken } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(account: Account): Promise<IJwtToken> {
    const { username, password } = account;
    const user = await this.accountService.getAccount(username);

    const result = await compare(password, user.password);

    if (!result) throw new UnauthorizedException();

    return {
      accessToken: await this.jwtService.signAsync({ username }),
    };
  }
}

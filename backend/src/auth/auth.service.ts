import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Account } from '../account/account.model';
import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(account: Account): Promise<string> {
    await this.accountService.createAccount(account);

    return await this.jwtService.signAsync({ username: account.username });
  }

  async validateUser(account: Account): Promise<string> {
    const { username, password } = account;
    const user = await this.accountService.getAccount(username);

    if (!user) throw new UnauthorizedException();

    const result = await compare(password, user.password);

    if (!result) throw new UnauthorizedException();

    return await this.jwtService.signAsync({ username });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.AUTH_SECRET,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

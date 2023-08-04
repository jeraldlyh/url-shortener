import { Body, Controller, Post } from '@nestjs/common';
import { Account } from './account.model';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/create')
  async createAccount(@Body() account: Account): Promise<void> {
    return await this.accountService.createAccount(account);
  }
}

import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { Account } from './account.model';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(account: Account): Promise<void> {
    const salt = await genSalt();
    const hashedPassword = await hash(account.password, salt);

    account.password = hashedPassword;
    return await this.accountRepository.createAccount(account);
  }
}

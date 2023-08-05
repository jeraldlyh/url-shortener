import { BadRequestException, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { Account } from './account.model';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccount(username: string): Promise<Account> {
    return await this.accountRepository.getAccount(username);
  }

  async createAccount(account: Account): Promise<void> {
    const existingUser = await this.accountRepository.getAccount(
      account.username,
    );

    if (existingUser) throw new BadRequestException('Account already exists');

    const salt = await genSalt(+process.env.AUTH_SALT_ROUNDS);
    console.log(salt, 'gen');
    const hashedPassword = await hash(account.password, salt);

    account.password = hashedPassword;
    return await this.accountRepository.createAccount(account);
  }
}

import { Module } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  controllers: [],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}

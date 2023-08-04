import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { Account, AccountConverter } from './account.model';

@Injectable()
export class AccountRepository {
  private readonly accountCollection: string = 'account';

  async createAccount(account: Account): Promise<void> {
    await firebase
      .firestore()
      .collection(this.accountCollection)
      .withConverter(AccountConverter)
      .add(account);
  }
}

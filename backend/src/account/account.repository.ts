import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { Account, AccountConverter } from './account.model';

@Injectable()
export class AccountRepository {
  private readonly accountCollection: string = 'account';

  async getAccount(username: string): Promise<Account> {
    const user = await firebase
      .firestore()
      .collection(this.accountCollection)
      .doc(username)
      .withConverter(AccountConverter)
      .get();

    if (!user.exists) return;

    return user.data();
  }

  async createAccount(account: Account): Promise<void> {
    await firebase
      .firestore()
      .collection(this.accountCollection)
      .doc(account.username)
      .withConverter(AccountConverter)
      .set(account);
  }
}

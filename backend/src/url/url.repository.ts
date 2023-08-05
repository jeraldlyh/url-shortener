import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { AccountConverter } from '../account/account.model';
import { Url } from './url.model';

@Injectable()
export class UrlRepository {
  private readonly accountCollection: string = 'account';

  async validateIfUrlExist(redirectHash: string): Promise<boolean> {
    const result = await firebase
      .firestore()
      .collection(this.accountCollection)
      .where('urls', 'array-contains', { redirectHash })
      .get();

    return result.empty;
  }

  async createUrl(username: string, url: Url): Promise<void> {
    await firebase
      .firestore()
      .collection(this.accountCollection)
      .doc(username)
      .withConverter(AccountConverter)
      .update({
        urls: firebase.firestore.FieldValue.arrayUnion(url),
      });
  }
}

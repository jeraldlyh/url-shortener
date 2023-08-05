import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { AccountConverter } from '../account/account.model';
import { Url } from './url.model';

@Injectable()
export class UrlRepository {
  private readonly accountCollection: string = 'account';

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

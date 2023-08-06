import { Injectable } from '@nestjs/common';
import firebase from 'firebase-admin';
import { flatten } from 'lodash';
import { AccountConverter } from '../account/account.model';
import { IUrl, Url, UrlConverter } from './url.model';

@Injectable()
export class UrlRepository {
  private readonly accountCollection: string = 'account';

  async getAllUrl(): Promise<Map<string, IUrl>> {
    const result = await firebase
      .firestore()
      .collection(this.accountCollection)
      .withConverter(AccountConverter)
      .get();

    const flattenedArray = flatten(result.docs.map((doc) => doc.data().urls));

    return new Map(flattenedArray.map((url) => [url.redirectHash, url]));
  }

  async getAllUrlByUsername(username: string): Promise<IUrl[]> {
    const result = await firebase
      .firestore()
      .collection(this.accountCollection)
      .doc(username)
      .withConverter(AccountConverter)
      .get();

    return result.data().urls;
  }

  async validateIfUrlExist(redirectHash: string): Promise<boolean> {
    const result = await firebase
      .firestore()
      .collection(this.accountCollection)
      .where('urls', 'array-contains', { redirectHash })
      .get();

    return !result.empty;
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

  async updateQrCodes(username: string, urls: Url[]): Promise<void> {
    const serializedUrls = urls.map((url) => UrlConverter.toFirestore(url));

    await firebase
      .firestore()
      .collection(this.accountCollection)
      .doc(username)
      .update({ urls: serializedUrls });
  }
}

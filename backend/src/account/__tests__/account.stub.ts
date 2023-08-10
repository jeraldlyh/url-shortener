import { UrlStub } from '../../url/__tests__/url.stub';
import { Account } from '../account.model';

export const AccountStub = (): Account => ({
  username: 'test',
  password: 'test',
  createdAt: new Date(),
  isDeleted: false,
  urls: UrlStub(),
});

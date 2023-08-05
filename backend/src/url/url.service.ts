import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { Url } from './url.model';
import { UrlRepository } from './url.repository';

@Injectable()
export class UrlService {
  private readonly ALPHABETS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly URL_LENGTH = 10;

  constructor(private readonly urlRepository: UrlRepository) {}

  async createUrl(username: string, url: Url): Promise<void> {
    const nanoid = customAlphabet(this.ALPHABETS);
    const redirectHash = nanoid(this.URL_LENGTH);

    const isHashExists = await this.urlRepository.validateIfUrlExist(
      redirectHash,
    );

    url.redirectHash = isHashExists ? nanoid(this.URL_LENGTH) : redirectHash;
    url.createdAt = new Date();
    return await this.urlRepository.createUrl(username, url);
  }
}

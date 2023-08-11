import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { CreateQrCodeDto, IUrl, Url } from './url.model';
import { UrlRepository } from './url.repository';

@Injectable()
export class UrlService {
  private readonly ALPHABETS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly URL_LENGTH = 10;

  constructor(private readonly urlRepository: UrlRepository) {}

  async getAllUrlByUsername(username: string): Promise<IUrl[]> {
    return await this.urlRepository.getAllUrlByUsername(username);
  }

  async createUrl(username: string, url: Url): Promise<void> {
    const nanoid = customAlphabet(this.ALPHABETS);
    let redirectHash = nanoid(this.URL_LENGTH);

    // NOTE: Chances of collisions can be found here: https://zelark.github.io/nano-id-cc/
    while (await this.urlRepository.validateIfUrlExist(redirectHash)) {
      redirectHash = nanoid(this.URL_LENGTH);
    }

    url.redirectHash = redirectHash;
    url.createdAt = new Date();
    url.isDeleted = false;

    return await this.urlRepository.createUrl(username, url);
  }

  async getRedirectUrlByHash(
    redirectHash: string,
  ): Promise<string | undefined> {
    const urls = await this.urlRepository.getAllUrl();
    const entry = urls.get(redirectHash);

    return !entry.isDeleted && entry?.url;
  }

  async createQrCode(username: string, qrCode: CreateQrCodeDto): Promise<void> {
    const { redirectHash, ...rest } = qrCode;
    const urls = await this.urlRepository.getAllUrlByUsername(username);

    const updatedUrls = urls.map((url) => {
      if (url.redirectHash === redirectHash) {
        url.qrCode = rest.qrCode;
      }
      return url;
    });

    return await this.urlRepository.updateQrCode(username, updatedUrls);
  }

  async deleteUrl(username: string, redirectHash: string): Promise<void> {
    const urls = await this.urlRepository.getAllUrlByUsername(username);
    const updatedUrls = urls.map((url) => {
      if (url.redirectHash === redirectHash) {
        url.isDeleted = true;
      }
      return url;
    });

    return await this.urlRepository.updateQrCode(username, updatedUrls);
  }
}

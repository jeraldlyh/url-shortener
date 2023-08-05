import { Injectable } from '@nestjs/common';
import { Url } from './url.model';
import { UrlRepository } from './url.repository';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async createUrl(username: string, url: Url): Promise<void> {
    url.createdAt = new Date();
    return await this.urlRepository.createUrl(username, url);
  }
}

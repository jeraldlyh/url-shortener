import { Test, TestingModule } from '@nestjs/testing';
import * as nanoId from 'nanoid';
import { AuthStub } from '../../auth/__tests__/auth.stubs';
import { IUrl } from '../url.model';
import { UrlRepository } from '../url.repository';
import { UrlService } from '../url.service';
import { CreateQrCodeDtoStub, RedirectHashStub, UrlStub } from './url.stubs';

const mockValidateIfUrlExist = jest.fn();
jest.mock('../url.repository', () => ({
  UrlRepository: jest.fn().mockImplementation(() => ({
    getAllUrlByUsername: jest.fn().mockResolvedValue(UrlStub()),
    validateIfUrlExist: mockValidateIfUrlExist,
    createUrl: jest.fn(),
    updateQrCode: jest.fn(),
  })),
}));

describe('UrlService', () => {
  let urlService: UrlService;
  let urlRepository: UrlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, UrlRepository],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlRepository = module.get<UrlRepository>(UrlRepository);

    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  describe('urlService', () => {
    it('should have a defined service', () => {
      expect(urlService).toBeDefined();
    });

    it('should have a defined repository', () => {
      expect(urlRepository).toBeDefined();
    });
  });

  describe('when getAllUrlByUsername is called', () => {
    let urls: IUrl[];

    beforeEach(async () => {
      urls = await urlService.getAllUrlByUsername(AuthStub().username);
    });

    it('should call urlRepository', () => {
      expect(urlRepository.getAllUrlByUsername).toHaveBeenCalledWith(
        AuthStub().username,
      );
    });

    it('should return a list of urls', () => {
      expect(urls).toStrictEqual(UrlStub());
    });
  });

  describe('when createUrl is called', () => {
    it('should call urlRepository', async () => {
      const customAlphabetMock = jest.spyOn(nanoId, 'customAlphabet');
      customAlphabetMock.mockImplementation(() =>
        jest.fn().mockReturnValue(RedirectHashStub()),
      );

      await urlService.createUrl(AuthStub().username, UrlStub()[0]);

      expect(urlRepository.createUrl).toHaveBeenCalledWith(
        AuthStub().username,
        UrlStub()[0],
      );
    });

    it('should regerate redirect hash if it exists', async () => {
      const regeneratedHash = RedirectHashStub() + 'a';
      const customAlphabetMock = jest.spyOn(nanoId, 'customAlphabet');
      customAlphabetMock.mockImplementation(() =>
        jest
          .fn()
          .mockReturnValueOnce(RedirectHashStub())
          .mockReturnValueOnce(regeneratedHash),
      );
      mockValidateIfUrlExist
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      await urlService.createUrl(AuthStub().username, UrlStub()[0]);

      const updatedUrl = UrlStub()[0];
      updatedUrl.redirectHash = regeneratedHash;

      expect(urlRepository.createUrl).toHaveBeenCalledWith(
        AuthStub().username,
        updatedUrl,
      );
    });
  });

  describe('when createQrCode is called', () => {
    beforeEach(async () => {
      await urlService.createQrCode(AuthStub().username, CreateQrCodeDtoStub());
    });

    it('should update the fgColor for qrCode', () => {
      const { qrCode } = CreateQrCodeDtoStub();

      const updatedUrls = UrlStub();
      updatedUrls[0].qrCode = {
        ...qrCode,
        isCreated: true,
      };

      expect(urlRepository.updateQrCode).toBeCalledWith(
        AuthStub().username,
        updatedUrls,
      );
    });
  });

  describe('when deleteQrCode is called', () => {
    beforeEach(async () => {
      await urlService.deleteUrl(AuthStub().username, RedirectHashStub());
    });

    it('should soft delete the url', () => {
      const updatedUrls = UrlStub();
      updatedUrls[0].isDeleted = true;

      expect(urlRepository.updateQrCode).toBeCalledWith(
        AuthStub().username,
        updatedUrls,
      );
    });
  });
});

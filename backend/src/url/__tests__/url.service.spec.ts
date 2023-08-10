import { Test, TestingModule } from '@nestjs/testing';
import * as nanoId from 'nanoid';
import { AuthStub } from '../../auth/__tests__/auth.stubs';
import { IUrl } from '../url.model';
import { UrlRepository } from '../url.repository';
import { UrlService } from '../url.service';
import { CreateQrCodeDtoStub, RedirectHashStub, UrlStub } from './url.stub';

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
      const auth = AuthStub();
      const urls = UrlStub();
      const customAlphabetMock = jest.spyOn(nanoId, 'customAlphabet');
      customAlphabetMock.mockImplementation(() =>
        jest.fn().mockReturnValue(RedirectHashStub()),
      );

      await urlService.createUrl(auth.username, urls[0]);

      expect(urlRepository.createUrl).toHaveBeenCalledWith(
        auth.username,
        urls[0],
      );
    });

    it('should regerate redirect hash if it exists', async () => {
      const auth = AuthStub();
      const urls = UrlStub();
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

      await urlService.createUrl(auth.username, urls[0]);

      const updatedUrl = urls[0];
      updatedUrl.redirectHash = regeneratedHash;

      expect(urlRepository.createUrl).toHaveBeenCalledWith(
        auth.username,
        updatedUrl,
      );
    });
  });

  describe('when createQrCode is called', () => {
    it('should update the fgColor for qrCode', async () => {
      const auth = AuthStub();
      const qrCodeDto = CreateQrCodeDtoStub();
      await urlService.createQrCode(auth.username, qrCodeDto);

      const updatedUrls = UrlStub();
      updatedUrls[0].qrCode = {
        ...qrCodeDto.qrCode,
        isCreated: true,
      };

      expect(urlRepository.updateQrCode).toBeCalledWith(
        auth.username,
        updatedUrls,
      );
    });
  });

  describe('when deleteQrCode is called', () => {
    it('should soft delete the url', async () => {
      const auth = AuthStub();
      await urlService.deleteUrl(auth.username, RedirectHashStub());

      const updatedUrls = UrlStub();
      updatedUrls[0].isDeleted = true;

      expect(urlRepository.updateQrCode).toBeCalledWith(
        auth.username,
        updatedUrls,
      );
    });
  });
});

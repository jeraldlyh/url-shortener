import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthGuardMock, AuthStub } from '../../auth/__tests__/auth.stubs';
import { UrlController } from '../url.controller';
import { Url } from '../url.model';
import { UrlService } from '../url.service';
import { IRedirectUrl } from '../url.types';
import {
  CreateQrCodeDtoStub,
  RedirectHashStub,
  RedirectUrlStub,
  UrlStub,
} from './url.stub';

jest.mock('../url.service', () => ({
  UrlService: jest.fn().mockImplementation(() => ({
    getRedirectUrlByHash: jest.fn().mockResolvedValue(RedirectUrlStub()),
    getAllUrlByUsername: jest.fn().mockResolvedValue(UrlStub()),
    createUrl: jest.fn(),
    createQrCode: jest.fn(),
    deleteUrl: jest.fn(),
  })),
}));

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [UrlService],
    })
      .overrideGuard(AuthGuard)
      .useValue(AuthGuardMock)
      .compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  describe('urlController', () => {
    it('should have a defined controller', () => {
      expect(urlController).toBeDefined();
    });

    it('should have a defined service', () => {
      expect(urlService).toBeDefined();
    });
  });

  describe('when redirect is called', () => {
    let redirectUrl: IRedirectUrl;

    beforeEach(async () => {
      redirectUrl = await urlController.redirect(RedirectHashStub());
    });

    it('should call urlService', () => {
      expect(urlService.getRedirectUrlByHash).toHaveBeenCalledWith(
        RedirectHashStub(),
      );
    });

    it('should return url', () => {
      expect(redirectUrl).toEqual({ url: RedirectUrlStub() });
    });
  });

  describe('when getAllUrlByUsername is called', () => {
    let urls: Url[];

    beforeEach(async () => {
      urls = await urlController.getAllUrlByUsername(AuthStub());
    });

    it('should call urlService', () => {
      expect(urlService.getAllUrlByUsername).toHaveBeenCalledWith(
        AuthStub().username,
      );
    });

    it('should return a list of urls', () => {
      expect(urls).toStrictEqual(UrlStub());
    });
  });

  describe('when createUrl is called', () => {
    it('should call urlService', async () => {
      const auth = AuthStub();
      const urls = UrlStub();
      await urlController.createUrl(auth, urls[0]);

      expect(urlService.createUrl).toHaveBeenCalledWith(auth.username, urls[0]);
    });
  });

  describe('when createQrCode is called', () => {
    it('should call urlService', async () => {
      const auth = AuthStub();
      const qrCodeDto = CreateQrCodeDtoStub();
      await urlController.createQrCode(auth, qrCodeDto);

      expect(urlService.createQrCode).toHaveBeenCalledWith(
        auth.username,
        qrCodeDto,
      );
    });
  });

  describe('when deleteQrCode is called', () => {
    it('should call urlService', async () => {
      const auth = AuthStub();
      const redirectHash = RedirectHashStub();
      await urlController.deleteUrl(auth, redirectHash);

      expect(urlService.deleteUrl).toHaveBeenCalledWith(
        auth.username,
        redirectHash,
      );
    });
  });
});

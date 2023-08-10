import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthStub } from '../../auth/__tests__/auth.stubs';
import { UrlController } from '../url.controller';
import { IUrl } from '../url.model';
import { UrlService } from '../url.service';
import { IRedirectUrl } from '../url.types';
import {
  AuthGuardMock,
  CreateQrCodeDtoStub,
  RedirectHashStub,
  RedirectUrlStub,
  UrlStub,
} from './url.stub';

jest.mock('../url.service', () => ({
  UrlService: jest.fn().mockImplementation(() => ({
    getRedirectUrlByHash: jest.fn().mockResolvedValue(RedirectUrlStub),
    getAllUrlByUsername: jest.fn().mockResolvedValue(UrlStub),
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
      expect(redirectUrl).toEqual({ url: RedirectUrlStub });
    });
  });

  describe('when getAllUrlByUsername is called', () => {
    let urls: IUrl[];

    beforeEach(async () => {
      urls = await urlController.getAllUrlByUsername(AuthStub());
    });

    it('should call urlService', () => {
      expect(urlService.getAllUrlByUsername).toHaveBeenCalledWith(
        AuthStub().username,
      );
    });

    it('should return a list of urls', () => {
      expect(urls).toBe(UrlStub);
    });
  });

  describe('when createUrl is called', () => {
    beforeEach(async () => {
      await urlController.createUrl(AuthStub(), UrlStub()[0]);
    });

    it('should call urlService', () => {
      expect(urlService.createUrl).toHaveBeenCalledWith(
        AuthStub().username,
        UrlStub()[0],
      );
    });
  });

  describe('when createQrCode is called', () => {
    beforeEach(async () => {
      await urlController.createQrCode(AuthStub(), CreateQrCodeDtoStub());
    });

    it('should call urlService', () => {
      expect(urlService.createQrCode).toHaveBeenCalledWith(
        AuthStub().username,
        CreateQrCodeDtoStub(),
      );
    });
  });

  describe('when deleteQrCode is called', () => {
    beforeEach(async () => {
      await urlController.deleteUrl(AuthStub(), RedirectHashStub());
    });

    it('should call urlService', () => {
      expect(urlService.deleteUrl).toHaveBeenCalledWith(
        AuthStub().username,
        RedirectHashStub(),
      );
    });
  });
});

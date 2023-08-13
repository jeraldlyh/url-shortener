import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AccountStub } from '../../account/__tests__/account.stub';
import { AuthController } from '../auth.controller';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';
import { AuthGuardMock, AuthStub } from './auth.stubs';

jest.mock('../auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    createAccount: jest.fn(),
    validateUser: jest.fn().mockResolvedValue(true),
    validateToken: jest.fn().mockResolvedValue(true),
  })),
}));

const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnValue(200),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideGuard(AuthGuard)
      .useValue(AuthGuardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  describe('authController', () => {
    it('should have a defined controller', () => {
      expect(authController).toBeDefined();
    });

    it('should have a defined service', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('when signUp is called', () => {
    beforeEach(async () => {
      await authController.signUp(AccountStub(), mockResponse);
    });

    it('should call authService', () => {
      expect(authService.createAccount).toBeCalledWith(AccountStub());
    });

    it('should set accessToken', () => {
      expect(mockResponse.cookie).toHaveBeenCalled();
    });
  });

  describe('when signIn is called', () => {
    beforeEach(async () => {
      await authController.signIn(AccountStub(), mockResponse);
    });

    it('should call authService', () => {
      expect(authService.validateUser).toBeCalledWith(AccountStub());
    });

    it('should set accessToken', () => {
      expect(mockResponse.cookie).toHaveBeenCalled();
    });
  });

  describe('when signOut is called', () => {
    it('should clear cookies', async () => {
      await authController.signOut(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalled();
    });
  });

  describe('when validate is called', () => {
    it('should call authService', async () => {
      const auth = AuthStub();
      await authController.validate(auth);

      expect(authService.validateToken).toBeCalledWith(auth.token);
    });
  });
});

import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { genSalt, hash } from 'bcryptjs';
import { AccountModule } from '../../account/account.module';
import { AccountService } from '../../account/account.service';
import { AccountStub } from '../../account/__tests__/account.stub';
import { jwtConfig } from '../auth.config';
import { AuthService } from '../auth.service';
import { JwtStub } from './auth.stubs';

const mockGetAccount = jest.fn();
jest.mock('../../account/account.service', () => ({
  AccountService: jest.fn().mockImplementation(() => ({
    createAccount: jest.fn(),
    getAccount: mockGetAccount,
    _hashPassword: jest
      .fn()
      .mockImplementation(async (password: string): Promise<string> => {
        const salt = await genSalt(+process.env.AUTH_SALT_ROUNDS);
        return await hash(password, salt);
      }),
  })),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let accountService: AccountService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, JwtModule.registerAsync(jwtConfig)],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    accountService = module.get<AccountService>(AccountService);
    jwtService = module.get<JwtService>(JwtService);

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  describe('authService', () => {
    it('should have a defined account service', () => {
      expect(accountService).toBeDefined();
    });

    it('should have a defined jwt service', () => {
      expect(jwtService).toBeDefined();
    });
  });

  describe('when createAccount is called', () => {
    let token: string;

    beforeEach(async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(JwtStub());
      token = await authService.createAccount(AccountStub());
    });

    it('should call accountService', () => {
      expect(accountService.createAccount).toBeCalledWith(AccountStub());
    });

    it('should call jwtService', () => {
      expect(jwtService.signAsync).toBeCalledWith({
        username: AccountStub().username,
      });
    });

    it('should return an accessToken', () => {
      expect(token).toBe(JwtStub());
    });
  });

  describe('when validateUser is called', () => {
    beforeEach(() => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(JwtStub());
    });

    afterEach(() => {
      mockGetAccount.mockReset();
    });

    it('should call accountService', async () => {
      const account = AccountStub();
      const accountWithHashedPasssword = AccountStub();
      accountWithHashedPasssword.password = await accountService._hashPassword(
        accountWithHashedPasssword.password,
      );
      mockGetAccount.mockResolvedValue(accountWithHashedPasssword);

      await authService.validateUser(account);

      expect(accountService.getAccount).toBeCalledWith(account.username);
    });

    it('should call jwtService', async () => {
      const account = AccountStub();
      const accountWithHashedPasssword = AccountStub();
      accountWithHashedPasssword.password = await accountService._hashPassword(
        accountWithHashedPasssword.password,
      );
      mockGetAccount.mockResolvedValue(accountWithHashedPasssword);

      await authService.validateUser(account);

      expect(jwtService.signAsync).toBeCalledWith({
        username: account.username,
      });
    });

    it('should throw an UnauthorizedException if user account does not exist', async () => {
      await expect(authService.validateUser(AccountStub())).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if password does not match', async () => {
      mockGetAccount.mockResolvedValue(AccountStub());

      await expect(authService.validateUser(AccountStub())).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('when validateToken is called', () => {
    it('should call jwtService', async () => {
      const token = 'token';
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue({ username: 'test' });

      await authService.validateToken(token);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.AUTH_SECRET,
      });
    });
  });
});

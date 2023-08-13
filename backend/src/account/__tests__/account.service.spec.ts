import { Test, TestingModule } from '@nestjs/testing';
import { AuthStub } from '../../auth/__tests__/auth.stubs';
import { Account } from '../account.model';
import { AccountRepository } from '../account.repository';
import { AccountService } from '../account.service';
import { AccountStub } from './account.stub';

const mockGetAccount = jest.fn();
jest.mock('../account.repository', () => ({
  AccountRepository: jest.fn().mockImplementation(() => ({
    getAccount: mockGetAccount,
    createAccount: jest.fn(),
  })),
}));

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, AccountRepository],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository);

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  afterEach(() => {
    mockGetAccount.mockReset();
  });

  describe('accountService', () => {
    it('should have a defined service', () => {
      expect(accountService).toBeDefined();
    });

    it('should have a defined repository', () => {
      expect(accountRepository).toBeDefined();
    });
  });

  describe('when getAccount is called', () => {
    let account: Account;

    beforeEach(async () => {
      mockGetAccount.mockResolvedValue(AccountStub());
      account = await accountService.getAccount(AuthStub().username);
    });

    it('should call accountRepository', () => {
      expect(accountRepository.getAccount).toBeCalledWith(AuthStub().username);
    });

    it('should return an account', () => {
      expect(account).toStrictEqual(AccountStub());
    });
  });

  describe('when createAccount is called', () => {
    it('should call accountRepository', async () => {
      const account = AccountStub();
      await accountService.createAccount(account);
      account.password = await accountService._hashPassword(account.password);

      expect(accountRepository.createAccount).toBeCalledWith(account);
    });

    it('should throw an exception if account already exists', async () => {
      const account = AccountStub();
      mockGetAccount.mockResolvedValue(account);

      await expect(accountService.createAccount(account)).rejects.toThrow(
        'Account already exists',
      );
    });
  });
});

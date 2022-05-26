import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceError } from 'src/shared/errors/service.error';
import { TransactionsRepository } from 'src/transactions/transaction.repository';
import { AccountEntity } from '../account.entity';
import { AccountsService } from '../accounts.service';

jest.mock('src/shared/helpers/start-transaction.helper', () => ({
  startTransaction: (callback) => callback(),
}));

const accountRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const saveSpy = jest.spyOn(accountRepository, 'save');
const findOneSpy = jest.spyOn(accountRepository, 'findOne');
const findSpy = jest.spyOn(accountRepository, 'find');
const updateAccountSpy = jest.spyOn(accountRepository, 'update');
const deleteAccountSpy = jest.spyOn(accountRepository, 'delete');

const transactionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  calcWithdrawnAmount: jest.fn(),
};

describe('accounts service', () => {
  let accountsService: AccountsService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(AccountEntity),
          useFactory: () => accountRepository,
        },
        {
          provide: TransactionsRepository,
          useFactory: () => transactionRepository,
        },
        AccountsService,
      ],
    }).compile();

    accountsService = moduleRef.get<AccountsService>(AccountsService);
  });

  it('should deposit funds into the account', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAmount = 200;
    const mockAccount = {
      balance: 300,
      isActive: true,
    };
    const mockTransaction = {};
    const mockTransactionEntity = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);
    saveSpy.mockResolvedValueOnce(true);
    transactionRepository.create.mockResolvedValueOnce(mockTransaction);
    transactionRepository.save.mockResolvedValueOnce(mockTransactionEntity);
    const depositResult = await accountsService.deposit(
      mockAccountId,
      mockAmount,
    );

    expect(depositResult).toStrictEqual(mockTransactionEntity);
    expect(accountRepository.save).toBeCalledWith({
      balance: 500,
      isActive: true,
    });
  });
  it('should throw an error in case of deactivated account', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAmount = 200;
    const mockAccount = {
      balance: 300,
      isActive: false,
    };
    const mockTransaction = {};
    const mockTransactionEntity = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);
    saveSpy.mockResolvedValueOnce(true);
    transactionRepository.create.mockResolvedValueOnce(mockTransaction);
    transactionRepository.save.mockResolvedValueOnce(mockTransactionEntity);

    await expect(async () => {
      await accountsService.deposit(mockAccountId, mockAmount);
    }).rejects.toThrow(new ServiceError('account_is_deactivated'));
  });
  it('should activate account using underlying repository', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAccount = {
      isActive: false,
    } as AccountEntity;

    findOneSpy.mockResolvedValueOnce(mockAccount);
    updateAccountSpy.mockResolvedValueOnce(true);

    await accountsService.activateAccount(mockAccountId);

    expect(updateAccountSpy).toBeCalledWith(mockAccountId, {
      isActive: true,
    });
  });

  it('should withdraw funds from an account', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAmount = 200;
    const mockAccount = {
      balance: 300,
      isActive: true,
    };
    const mockTransaction = {};
    const mockTransactionEntity = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);
    saveSpy.mockResolvedValueOnce(true);
    transactionRepository.create.mockResolvedValueOnce(mockTransaction);
    transactionRepository.save.mockResolvedValueOnce(mockTransactionEntity);
    transactionRepository.calcWithdrawnAmount.mockResolvedValueOnce(0);

    await accountsService.withdraw(mockAccountId, mockAmount);

    expect(accountRepository.update).toBeCalledWith(mockAccountId, {
      balance: 100,
      isActive: true,
    });
  });
  it('should throw an error in case of insufficient funds', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAmount = 200;
    const mockAccount = {
      balance: 10,
      isActive: true,
    };
    const mockTransaction = {};
    const mockTransactionEntity = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);
    saveSpy.mockResolvedValueOnce(true);
    transactionRepository.create.mockResolvedValueOnce(mockTransaction);
    transactionRepository.save.mockResolvedValueOnce(mockTransactionEntity);

    await expect(async () => {
      await accountsService.withdraw(mockAccountId, mockAmount);
    }).rejects.toThrow(new ServiceError('insufficient_funds'));
  });
  it('should throw an error in case of deactivated account', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAmount = 200;
    const mockAccount = {
      balance: 300,
      isActive: false,
    };
    const mockTransaction = {};
    const mockTransactionEntity = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);
    saveSpy.mockResolvedValueOnce(true);
    transactionRepository.create.mockResolvedValueOnce(mockTransaction);
    transactionRepository.save.mockResolvedValueOnce(mockTransactionEntity);

    await expect(async () => {
      await accountsService.withdraw(mockAccountId, mockAmount);
    }).rejects.toThrow(new ServiceError('account_is_deactivated'));
  });
  it('should activate account using underlying repository', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAccount = {
      isActive: false,
    } as AccountEntity;

    findOneSpy.mockResolvedValueOnce(mockAccount);
    updateAccountSpy.mockResolvedValueOnce(true);

    await accountsService.activateAccount(mockAccountId);

    expect(updateAccountSpy).toBeCalledWith(mockAccountId, {
      isActive: true,
    });
  });
  it('should throw an service error when performing deactivation operation in case account is already deactivated', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAccount = {
      isActive: true,
    } as AccountEntity;

    findOneSpy.mockResolvedValueOnce(mockAccount);
    updateAccountSpy.mockResolvedValueOnce(true);

    await expect(() =>
      accountsService.activateAccount(mockAccountId),
    ).rejects.toThrowError(new ServiceError('already_activated'));
  });
  it('should deactivate account using underlying repository', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAccount = {
      isActive: true,
    } as AccountEntity;

    findOneSpy.mockResolvedValueOnce(mockAccount);
    updateAccountSpy.mockResolvedValueOnce(true);

    await accountsService.deactivateAccount(mockAccountId);

    expect(updateAccountSpy).toBeCalledWith(mockAccountId, {
      isActive: false,
    });
  });

  it('should throw an service error when performing deactivation operation in case account is already deactivated', async () => {
    const mockAccountId = 'mock-account-id';
    const mockAccount = {
      isActive: false,
    } as AccountEntity;

    findOneSpy.mockResolvedValueOnce(mockAccount);
    updateAccountSpy.mockResolvedValueOnce(true);

    await expect(() =>
      accountsService.deactivateAccount(mockAccountId),
    ).rejects.toThrowError(new ServiceError('already_deactivated'));
  });
  it('should create a new account in the database', async () => {
    const mockAccount = {
      balance: 100,
    };
    saveSpy.mockImplementationOnce((rawAccount) => Promise.resolve(rawAccount));

    const creationResult = await accountsService.create(
      mockAccount as AccountEntity,
    );

    expect(creationResult.balance).toStrictEqual(mockAccount.balance);
  });
  it("should return person account's found by id in the database", async () => {
    const mockAccounts = [{}];
    findSpy.mockResolvedValueOnce(mockAccounts);

    const findResult = await accountsService.findPersonAccounts(
      'mock-person-id',
      'mock-account-id',
    );

    expect(findResult).toStrictEqual(mockAccounts);
  });
  it('should return account found by id in the database', async () => {
    const mockId = 'mock-id';
    const mockAccount = {};
    findOneSpy.mockResolvedValueOnce(mockAccount);

    const findResult = await accountsService.findById(mockId);

    expect(findResult).toStrictEqual(mockAccount);
  });
  it('should return all accounts from the repository', async () => {
    const mockAccounts = [{}];
    findSpy.mockResolvedValueOnce(mockAccounts);

    const findAllResult = await accountsService.findAll();

    expect(findAllResult).toStrictEqual(mockAccounts);
    expect(findSpy).toBeCalled();
  });
  it('should update account via repository', async () => {
    const mockAccountId = 'test-id';
    const mockAccount = {} as AccountEntity;

    await accountsService.update(mockAccountId, mockAccount);

    expect(updateAccountSpy).toBeCalledWith(
      {
        accountId: mockAccountId,
      },
      mockAccount,
    );
  });

  it('should delegate deletion to the underlying repository', async () => {
    const mockAccountId = 'test-id';

    await accountsService.remove(mockAccountId);

    expect(deleteAccountSpy).toBeCalledWith(mockAccountId);
  });
});

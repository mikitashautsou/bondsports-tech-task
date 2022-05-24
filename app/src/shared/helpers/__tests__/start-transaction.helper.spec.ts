import { startTransaction } from '../start-transaction.helper';

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
};

jest.mock('typeorm', () => ({
  getConnection: () => ({
    createQueryRunner: () => mockQueryRunner,
  }),
}));

describe('start transaction helper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should commit transaction in case of no errors', async () => {
    const mockResult = {
      testResult: 'data',
    };

    const transactionResult = await startTransaction(async () => mockResult);

    expect(transactionResult).toEqual(mockResult);
    expect(mockQueryRunner.startTransaction).toBeCalled();
    expect(mockQueryRunner.commitTransaction).toBeCalled();
    expect(mockQueryRunner.release).toBeCalled();
  });

  it('should rollback transaction in case any errors', async () => {
    await expect(() =>
      startTransaction(async () => {
        throw new Error('test error');
      }),
    ).rejects.toThrow('test error');
    expect(mockQueryRunner.startTransaction).toBeCalled();
    expect(mockQueryRunner.rollbackTransaction).toBeCalled();
    expect(mockQueryRunner.release).toBeCalled();
  });
});

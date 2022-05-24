import { getConnection } from 'typeorm';

export const startTransaction = async <T>(
  originalMethod: (...args) => T,
): Promise<T> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const result = await originalMethod();
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

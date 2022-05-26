import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class transactionsTable1653579450645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'transactionId',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            isNullable: false,
          },
          {
            name: 'accountId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'numeric(15,2)',
            isNullable: false,
          },
          {
            name: 'transactionDate',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );
    const foreignKey = new TableForeignKey({
      columnNames: ['accountId'],
      referencedColumnNames: ['accountId'],
      referencedTableName: 'accounts',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('transactions', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}

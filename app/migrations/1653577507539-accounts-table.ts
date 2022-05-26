import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class accountsTable1653577507539 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'accountId',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            isNullable: false,
          },
          {
            name: 'personId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'balance',
            type: 'numeric(15,2)',
            isNullable: false,
          },
          {
            name: 'dailyWithdrawLimit',
            type: 'numeric(15,2)',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            isNullable: false,
          },

          {
            name: 'accountType',
            type: 'enum',
            enum: ['PERSONAL', 'CORPORATE'],
            isNullable: false,
          },
          {
            name: 'creationDate',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );
    const foreignKey = new TableForeignKey({
      columnNames: ['personId'],
      referencedColumnNames: ['personId'],
      referencedTableName: 'persons',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('accounts', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts');
  }
}

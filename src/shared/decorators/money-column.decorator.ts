import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';
import { DecimalTransformer } from '../transformers/decimal.transformer';

export const MonetaryColumn = () => {
  return applyDecorators(
    Column({
      type: 'decimal',
      precision: 5,
      scale: 2,
      transformer: new DecimalTransformer(),
    }),
  );
};

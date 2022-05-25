import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';
import { DecimalTransformer } from '../transformers/decimal.transformer';

interface Config {
  default?: any;
}
export const MonetaryColumn = (config?: Config) => {
  return applyDecorators(
    Column({
      type: 'decimal',
      precision: 15,
      scale: 2,
      transformer: new DecimalTransformer(),
      default: config?.default,
    }),
  );
};

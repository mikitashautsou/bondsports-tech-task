import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PersonEntity } from '../person.entity';

export class UpdatePersonDTO {
  @ApiProperty()
  @Optional()
  name: string;

  @ApiProperty()
  @Optional()
  document: string;

  @ApiProperty()
  @Optional()
  birthDate: Date;

  constructor(initialData: Partial<PersonEntity>) {
    Object.assign(this, initialData);
  }
}

import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PersonEntity } from '../person.entity';

export class CreatePersonDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  document: string;

  @ApiProperty()
  @IsNotEmpty()
  birthDate: Date;

  constructor(initialData: Partial<PersonEntity>) {
    Object.assign(this, initialData);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { PersonEntity } from '../person.entity';

export class PersonDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  document: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  constructor(initialData: Partial<PersonEntity>) {
    Object.assign(this, initialData);
  }
}

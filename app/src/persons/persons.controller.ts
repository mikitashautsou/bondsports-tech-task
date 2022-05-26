import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonDTO } from './dto/create-person.dto';
import { PersonDTO } from './dto/person.dto';
import { UpdatePersonDTO } from './dto/update-person.dto';
import { PersonEntity } from './person.entity';
import { PersonsService } from './persons.service';

@Controller('persons')
@ApiTags('persons')
export class PersonsController {
  constructor(private personsService: PersonsService) {}

  @Post()
  async create(@Body() createPersonDTO: CreatePersonDTO) {
    return await this.personsService.create(new PersonEntity(createPersonDTO));
  }

  @Get(':personId')
  @ApiResponse({
    type: PersonDTO,
  })
  async findById(@Param('personId') personId: string) {
    const personEntity = await this.personsService.findById(personId);
    if (!personEntity) {
      return {
        status: 'person_not_found',
      };
    }
    return personEntity.toDTO();
  }

  @Get()
  @ApiResponse({
    type: [PersonDTO],
  })
  async findAll(): Promise<PersonDTO[]> {
    const persons = await this.personsService.findAll();
    return persons.map((p) => p.toDTO());
  }

  @Patch(':personId')
  async update(
    @Param('personId') personId: string,
    @Body() updatePersonDTO: UpdatePersonDTO,
  ) {
    return await this.personsService.update(
      personId,
      new PersonEntity(updatePersonDTO),
    );
  }

  @Delete(':personId')
  async delete(@Param('personId') personId: string) {
    return await this.personsService.remove(personId);
  }
}

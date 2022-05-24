import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonDTO } from './dto/person.dto';
import { PersonEntity } from './person.entity';
import { PersonsService } from './persons.service';

@Controller('persons')
@ApiTags('persons')
export class PersonsController {
  constructor(private personsService: PersonsService) {}

  @Post()
  async create(@Body() createPersonDTO: PersonDTO) {
    return await this.personsService.create(new PersonEntity(createPersonDTO));
  }

  @Get(':personId')
  @ApiResponse({
    type: PersonDTO,
  })
  async findById(@Param('personId') personId: string) {
    const personEntity = await this.personsService.findById(personId);
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

  @Put(':personId')
  async update(
    @Param('personId') personId: string,
    @Body() updatePersonDTO: PersonDTO,
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

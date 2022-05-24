import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from './person.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(PersonEntity)
    private personsRepository: Repository<PersonEntity>,
  ) {}

  async create(person: PersonEntity): Promise<PersonEntity> {
    return await this.personsRepository.save(person);
  }

  async findById(id: string): Promise<PersonEntity> {
    return await this.personsRepository.findOne({
      where: { personId: id },
    });
  }

  async findAll(): Promise<PersonEntity[]> {
    return await this.personsRepository.find();
  }

  async update(id: string, person: PersonEntity): Promise<void> {
    await this.personsRepository.update({ personId: id }, person);
  }

  async remove(id: string): Promise<void> {
    await this.personsRepository.delete(id);
  }
}

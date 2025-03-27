import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDTO } from './dto/create-borrower.dto';
import { User } from '../user/entities/user.entity';
import * as SYS_MSG from '@shared/constants/SystemMessages';
import { CustomHttpException } from '@shared/helpers/custom-http-filter';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class BorrowerService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDTO, user: User): Promise<Borrower> {
    const borrower = this.borrowerRepository.create({
      name: createBorrowerDto.company_name,
      number_of_employees: createBorrowerDto.number_of_employees,
      ceo: createBorrowerDto.ceo,
      gender_of_ceo: createBorrowerDto.gender_of_ceo,
      birth_year: createBorrowerDto.birth_year,
      user: user,
    });

    try {
      return await this.borrowerRepository.save(borrower);
    } catch (error) {
      throw new CustomHttpException(SYS_MSG.FAILED_TO_CREATE_BORROWER, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUserId(userId: string): Promise<Borrower> {
    const borrower = await this.borrowerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'guarantees'],
    });

    if (!borrower) {
      throw new CustomHttpException(SYS_MSG.BORROWER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return borrower;
  }

  async findAll(): Promise<Borrower[]> {
    return this.borrowerRepository.find({
      relations: ['user', 'guarantees'],
    });
  }
}

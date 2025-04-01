import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDTO } from './dto/create-borrower.dto';
import { User } from '../user/entities/user.entity';
import * as SYS_MSG from '@shared/constants/SystemMessages';
import { CustomHttpException } from '@shared/helpers/custom-http-filter';
import { HttpStatus } from '@nestjs/common';
import { UserType } from '../user/interface/UserInterface';
import { BorrowerInterface } from './interface/borrowerInterface';
import { AuthJwtPayload } from '../token/interface/token.interface';

@Injectable()
export class BorrowerService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDTO): Promise<Borrower> {
    const user = await this.userRepository.findOne({
      where: { id: createBorrowerDto.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const existingBorrower = await this.borrowerRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingBorrower) throw new BadRequestException('User already has a borrower profile');

    const borrower = this.borrowerRepository.create({
      ...createBorrowerDto,
      user,
    });

    return await this.borrowerRepository.save(borrower);
  }

  async findByUserId(userId: string): Promise<Borrower> {
    const borrower = await this.borrowerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!borrower) throw new CustomHttpException(SYS_MSG.BORROWER_NOT_FOUND, HttpStatus.NOT_FOUND);

    return borrower;
  }

  async findAll(page: number = 1, limit: number = 10, currentUser: BorrowerInterface): Promise<any> {
    const [borrowers, total] = await this.borrowerRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const pagination = {
      current_page: page,
      total_pages: Math.ceil(total / limit),
      total_borrowers: total,
      limit,
    };

    const formattedBorrowers = borrowers.map((borrower) => ({
      id: borrower.id,
      company_name: borrower.company_name,
      number_of_employees: borrower.number_of_employees,
      ceo: borrower.ceo,
      gender_of_ceo: borrower.gender_of_ceo,
      birth_year: borrower.birth_year,
      user: {
        id: borrower.user.id,
        first_name: borrower.user.first_name,
        last_name: borrower.user.last_name,
        email: borrower.user.email,
        phone: borrower.user.phone,
        is_active: borrower.user.is_active,
      },
      created_at: borrower.created_at,
      updated_at: borrower.updated_at,
    }));

    return {
      status: 'success',
      message: 'Borrowers retrieved successfully',
      data: {
        borrowers: formattedBorrowers,
        pagination,
      },
    };
  }
}

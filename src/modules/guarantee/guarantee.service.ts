import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guarantee } from './entities/guarantee.entity';
import { CreateGuaranteeDto } from './dto/create-guarantee.dto';

@Injectable()
export class GuaranteeService {
  constructor(
    @InjectRepository(Guarantee)
    private guaranteeRepository: Repository<Guarantee>,
  ) {}

  async create(createGuaranteeDto: CreateGuaranteeDto): Promise<Guarantee> {
    const guarantee = this.guaranteeRepository.create(createGuaranteeDto);
    return this.guaranteeRepository.save(guarantee);
  }

  async findAll(): Promise<Guarantee[]> {
    return this.guaranteeRepository.find({ relations: ['borrower', 'collaterals', 'claims'] });
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { GuaranteeService } from './guarantee.service';
import { CreateGuaranteeDto } from './dto/create-guarantee.dto';

@Controller('guarantee')
export class GuaranteeController {
  constructor(private readonly guaranteeService: GuaranteeService) {}

  @Post()
  create(@Body() createGuaranteeDto: CreateGuaranteeDto) {
    return this.guaranteeService.create(createGuaranteeDto);
  }

  @Get()
  findAll() {
    return this.guaranteeService.findAll();
  }
}

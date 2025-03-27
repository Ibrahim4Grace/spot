import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowerService } from './borrower.service';
import { BorrowerController } from './borrower.controller';
import { Borrower } from './entities/borrower.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower])],
  controllers: [BorrowerController],
  providers: [BorrowerService, Repository],
  exports: [BorrowerService],
})
export class BorrowerModule {}

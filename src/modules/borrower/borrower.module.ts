import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowerController } from './borrower.controller';
import { BorrowerService } from './borrower.service';
import { Borrower } from './entities/borrower.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower, User])],
  controllers: [BorrowerController],
  providers: [BorrowerService],
  exports: [BorrowerService],
})
export class BorrowerModule {}

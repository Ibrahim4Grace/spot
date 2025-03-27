import { Module } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import { CollateralController } from './collateral.controller';
import { Collateral } from './entities/collateral.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CollateralService, Repository],
  imports: [TypeOrmModule.forFeature([Collateral])],
  controllers: [CollateralController],
  exports: [CollateralService],
})
export class CollateralModule {}

import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permissions.entity';
import { Role } from '@modules/role/entities/role.entity';

@Module({
  providers: [PermissionsService],
  controllers: [PermissionsController],
  imports: [TypeOrmModule.forFeature([Permissions, Role])],
})
export class OrganisationPermissionsModule {}

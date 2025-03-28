import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CustomHttpException } from '@shared/helpers/custom-http-filter';
import { Role } from '@modules/role/entities/role.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly userRoleManager: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUserId = request.user.sub;

    const adminRole = await this.userRoleManager.findOne({
      where: { name: 'super-admin' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      throw new CustomHttpException('Admin Role does not exist', HttpStatus.BAD_REQUEST);
    }

    // const userRole = await this.organisationMembersRole.find({
    //   where: { userId: currentUserId, roleId: adminRole.id },
    // });

    // if (!userRole.length) {
    //   throw new CustomHttpException('Access denied', HttpStatus.FORBIDDEN);
    // }
    return true;
  }
}

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePermissionDto, CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @ApiOperation({ summary: 'Create Permission' })
  @ApiResponse({
    status: 200,
    description: 'Create a new existing permission',
    type: CreatePermissionDto,
  })
  @Post('')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto.title);
  }

  @ApiOperation({ summary: 'Update Permission' })
  @ApiResponse({
    status: 200,
    description: 'Update an existing permission',
    type: CreatePermissionDto,
  })
  @Patch('/:permission_id')
  async updatePermission(@Body() updatePermissionDto: UpdatePermissionDto, @Param('permission_id') id: string) {
    return await this.permissionService.updatePermission({ id, permission: updatePermissionDto });
  }

  @ApiOperation({ summary: 'Fetch all Permission' })
  @Get('')
  async getAllPermissions() {
    return await this.permissionService.getPermissions();
  }

  @ApiOperation({ summary: 'Fetch a single Permission' })
  @Get('/:permission_id')
  async getSinglePermission(@Param('permission_id') id: string) {
    return await this.permissionService.getSinglePermission(id);
  }
}

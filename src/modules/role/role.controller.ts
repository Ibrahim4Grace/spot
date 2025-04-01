import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AdminGuard } from '@guards/admin.guard';
import {
  AttachPermissionsApiBody,
  AttachPermissionsDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto/create-role-with-permission.dto';

@ApiTags('role Settings')
@UseGuards(AdminGuard)
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict - Role with this name already exists.' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createRole(createRoleDto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('/:roleId')
  @ApiOperation({ summary: 'Fetch a single role ' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the role' })
  @ApiResponse({ status: 200, description: 'The role has been successfully fetched.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid role ID format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found - Role does not exist.' })
  async findOne(@Param('roleId') roleId: string) {
    return await this.roleService.findSingleRole(roleId);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('/:roleId')
  @ApiOperation({ summary: 'Update a role ' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid role ID format or input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 404, description: 'Organisation not found' })
  async updateRole(updateRoleDto: UpdateRoleDto, @Param('roleId') roleId: string) {
    const data = await this.roleService.updateRole({ id: roleId, payload: updateRoleDto });

    return {
      status_code: 200,
      data,
    };
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('permissions')
  @ApiOperation({ summary: 'Attach permissions to a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated',
  })
  @ApiBody({ type: AttachPermissionsApiBody })
  @ApiResponse({ status: 400, description: 'Invalid role ID format or input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async attachPermissions(@Body() attachRoletoPermissionsDto: AttachPermissionsDto) {
    return await this.roleService.attachRoletoPermissions(attachRoletoPermissionsDto);
  }
}

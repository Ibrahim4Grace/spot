import { UserPayload } from './interface/UserInterface';
import UserService from './user.service';
import { AdminGuard } from '@guards/admin.guard';
import { AuthGuard } from '@guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  DeactivateAccountDto,
  UpdateUserDto,
  ReactivateAccountDto,
  UserDataExportDto,
  GetUserStatsResponseDto,
} from './dto/user-response.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({
    status: 200,
    description: 'User updated seuccessfully',
    type: UpdateUserDto,
  })
  @Patch(':userId')
  async updateUser(
    @Request() req: { user: UserPayload },
    @Param('userId') userId: string,
    @Body() updatedUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updatedUserDto, req.user);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Data (Admin only)' })
  @ApiResponse({ status: 200, description: 'User data fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get(':id')
  async getUserDataById(@Param('id') id: string) {
    return this.userService.getUserDataWithoutPasswordById(id);
  }

  @UseGuards(AdminGuard)
  @Patch('deactivate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'The account has been successfully deactivated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deactivateAccount(@Req() request: Request, @Body() deactivateAccountDto: DeactivateAccountDto) {
    const user = request['user'];

    if (!user || !user.userId) {
      throw new HttpException({ status_code: 401, error: 'User not authenticated' }, HttpStatus.UNAUTHORIZED);
    }

    const userId = user.userId;
    return this.userService.deactivateUser(userId, deactivateAccountDto);
  }

  @UseGuards(AdminGuard)
  @Patch('/reactivate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate a user account  (Admin only)' })
  @ApiResponse({ status: 200, description: 'The account has been successfully reactivated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async reactivateAccount(@Body() reactivateAccountDto: ReactivateAccountDto) {
    const { email } = reactivateAccountDto;

    return this.userService.reactivateUser(email, reactivateAccountDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Request() req: { user: UserPayload },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getUsersByAdmin(page, limit, req.user);
  }

  // @ApiQuery({
  //   name: 'format',
  //   description: 'The format in which the user data should be exported (e.g., JSON, XLSX)',
  //   enum: ['json', 'xlsx'],
  //   required: true,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the user data in the requested format.',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           user: {
  //             type: 'object',
  //             description: 'User data object',
  //           },
  //         },
  //       },
  //     },
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
  //       schema: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @Get('export')
  // async exportUserData(
  //   @Query() { format }: UserDataExportDto,
  //   @Res({ passthrough: false }) res: Response,
  //   @Req() { user },
  // ) {
  //   const file = await this.userService.exportUserDataAsJsonOrExcelFile(format, user.id, res);
  //   file.getStream().pipe(res);
  // }
}

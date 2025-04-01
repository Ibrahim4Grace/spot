import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BorrowerService } from './borrower.service';
import { CreateBorrowerDTO } from './dto/create-borrower.dto';
import { Borrower } from './entities/borrower.entity';
import { AdminGuard } from '@guards/admin.guard';
import { BorrowerInterface } from './interface/borrowerInterface';
import { AuthGuard } from '@guards/auth.guard';

@ApiTags('borrowers')
@Controller('borrowers')
export class BorrowerController {
  constructor(private readonly borrowerService: BorrowerService) {}

  // @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new borrower profile' })
  @ApiResponse({ status: 201, description: 'Borrower profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(@Body() createBorrowerDto: CreateBorrowerDTO): Promise<Borrower> {
    return this.borrowerService.create(createBorrowerDto);
  }

  // @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's borrower profile" })
  @ApiResponse({ status: 200, description: 'Borrower profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Borrower profile not found' })
  async getProfile(@Request() req: { user: BorrowerInterface }): Promise<Borrower> {
    return this.borrowerService.findByUserId(req.user.userId);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get borrower profile by ID' })
  @ApiResponse({ status: 200, description: 'Borrower profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Borrower profile not found' })
  async findOne(@Param('id') id: string): Promise<Borrower> {
    return this.borrowerService.findByUserId(id);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all borrower profiles' })
  @ApiResponse({ status: 200, description: 'All borrower profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Request() req: { user: BorrowerInterface },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.borrowerService.findAll(page, limit, req.user);
  }
}

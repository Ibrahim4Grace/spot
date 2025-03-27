import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowerService } from './borrower.service';
import { CreateBorrowerDTO } from './dto/create-borrower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Borrowers')
@Controller('borrowers')
export class BorrowerController {
  constructor(private readonly borrowerService: BorrowerService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new borrower' })
  @ApiResponse({ status: 201, description: 'Borrower registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createBorrowerDto: CreateBorrowerDTO) {
    return this.borrowerService.create(createBorrowerDto, null);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get borrower profile' })
  @ApiResponse({ status: 200, description: 'Borrower profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  async getProfile(@Req() req: Request) {
    const userId = req.user['id'];
    return this.borrowerService.findByUserId(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all borrowers' })
  @ApiResponse({ status: 200, description: 'Borrowers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.borrowerService.findAll();
  }
}

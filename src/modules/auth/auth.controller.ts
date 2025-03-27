import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import * as SYS_MSG from '@shared/constants/SystemMessages';
import { Body, Controller, HttpCode, Post, Req, Request, Patch } from '@nestjs/common';
import { skipAuth } from '@shared/helpers/skipAuth';
import AuthenticationService from './auth.service';
import { OtpDto } from '../otp/dto/otp.dto';
import GoogleAuthPayload from './interfaces/GoogleAuthPayloadInterface';
import { CustomHttpException } from '@shared/helpers/custom-http-filter';
import {
  ErrorCreateUserResponse,
  RequestVerificationToken,
  SuccessCreateUserResponse,
} from '../user/dto/user-response.dto';
import {
  RequestSigninTokenDto,
  LoginDto,
  LoginResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  CreateUserDTO,
  ChangePasswordDto,
  AuthResponseDto,
  GoogleAuthPayloadDto,
  GenericAuthResponseDto,
  UpdatePasswordDto,
  LoginErrorResponseDto,
  UpdateUserPasswordResponseDTO,
} from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth/user')
export default class RegistrationController {
  constructor(private authService: AuthenticationService) {}

  @skipAuth()
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, description: 'Register a new user', type: SuccessCreateUserResponse })
  @ApiResponse({ status: 400, description: 'User already exists', type: ErrorCreateUserResponse })
  @Post('register')
  @HttpCode(201)
  public async register(@Body() createUserDto: CreateUserDTO): Promise<any> {
    return this.authService.createNewUser(createUserDto);
  }

  @skipAuth()
  @HttpCode(200)
  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({ summary: 'Generate forgot password reset token' })
  @ApiResponse({
    status: 200,
    description: 'The forgot password reset token generated successfully',
    type: ForgotPasswordResponseDto,
  })
  @ApiBadRequestResponse({ description: SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @skipAuth()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials', type: LoginErrorResponseDto })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto | { status_code: number; message: string }> {
    return this.authService.loginUser(loginDto);
  }

  @skipAuth()
  @ApiOperation({ summary: 'Verify magic link otp' })
  @ApiBody({ type: AuthResponseDto })
  @ApiResponse({ status: 200, description: 'successfully verifies otp and logs in user' })
  @ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORISED_TOKEN })
  @HttpCode(200)
  @Post('verify-otp')
  public async verifyEmail(@Body() body: OtpDto): Promise<any> {
    return this.authService.verifyToken(body);
  }

  @skipAuth()
  @Post('google')
  @ApiOperation({ summary: 'Google Authentication' })
  @ApiBody({ type: GoogleAuthPayloadDto })
  @ApiResponse({ status: 200, description: 'Verify Payload sent from google', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Google authentication failed' })
  @HttpCode(200)
  async googleAuth(@Body() body: GoogleAuthPayload) {
    return this.authService.googleAuth(body);
  }

  @skipAuth()
  @ApiBody({
    description: 'Request authentication token',
    type: RequestVerificationToken,
  })
  @ApiOperation({ summary: 'Request Verification Token' })
  @ApiResponse({ status: 200, description: 'Verification Token sent to mail', type: GenericAuthResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request', type: CustomHttpException })
  @HttpCode(200)
  @Post('request/token')
  async requestVerificationToken(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.requestSignInToken({ email });
  }

  @skipAuth()
  @Post('magic-link')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Signin Token' })
  @ApiBody({ type: RequestSigninTokenDto })
  @ApiResponse({ status: 200, description: 'Sign-in token sent to email', type: GenericAuthResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async signInToken(@Body() body: RequestSigninTokenDto) {
    return await this.authService.requestSignInToken(body);
  }

  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  @Post('change-password')
  public async changePassword(@Body() body: ChangePasswordDto, @Req() request: Request): Promise<any> {
    const user = request['user'];
    const userId = user.id;
    return this.authService.changePassword(userId, body.oldPassword, body.newPassword);
  }

  @skipAuth()
  @Post('magic-link/verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify Signin Token' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 200, description: 'Sign-in successful', type: OtpDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async verifySignInToken(@Body() body: OtpDto) {
    return await this.authService.verifyToken(body);
  }

  @skipAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Otp and change user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully', type: UpdateUserPasswordResponseDTO })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch('password-reset')
  @HttpCode(200)
  public async resetPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updateForgotPassword(updatePasswordDto);
  }
}

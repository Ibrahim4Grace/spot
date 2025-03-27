import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as SYS_MSG from '@shared/constants/SystemMessages';
import { JwtService } from '@nestjs/jwt';
import UserService from '@modules/user/user.service';
import { OtpService } from '@modules/otp/otp.service';
import { EmailService } from '@modules/email/email.service';
import { CustomHttpException } from '@shared/helpers/custom-http-filter';
import GoogleAuthPayload from './interfaces/GoogleAuthPayloadInterface';
import { TokenPayload } from 'google-auth-library';
import { OtpDto } from '@modules/otp/dto/otp.dto';
import { DataSource, EntityManager } from 'typeorm';
import { BorrowerService } from '@modules/borrower/borrower.service';
import { CreateBorrowerDTO } from '@modules/borrower/dto/create-borrower.dto';
import {
  RequestSigninTokenDto,
  LoginResponseDto,
  LoginDto,
  UpdatePasswordDto,
  ForgotPasswordDto,
  CreateUserDTO,
  ChangePasswordDto,
  AuthResponseDto,
  GoogleAuthPayloadDto,
  GenericAuthResponseDto,
  LoginErrorResponseDto,
  UpdateUserPasswordResponseDTO,
} from './dto/auth-response.dto';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource,
  ) {}

  async createNewUser(createUserDto: CreateUserDTO) {
    const result = await this.dataSource.transaction(async (manager: EntityManager) => {
      const userExists = await this.userService.getUserRecord({
        identifier: createUserDto.email,
        identifierType: 'email',
      });

      if (userExists) throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_EXIST, HttpStatus.BAD_REQUEST);
      const user = await this.userService.createUser(createUserDto, manager);
      if (!user) throw new CustomHttpException(SYS_MSG.FAILED_TO_CREATE_USER, HttpStatus.BAD_REQUEST);

      const responsePayload = {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_type: user.user_type,
        },
      };
      return {
        message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
        data: responsePayload,
      };
    });

    try {
      // send welcome mail
      await this.emailService.sendUserConfirmationMail(
        result.data.user.email,
        result.data.user.first_name,
        result.data.user.last_name,
        `${process.env.FRONTEND_URL}/confirm-email`,
      );
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    return result;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string } | null> {
    const user = await this.userService.getUserRecord({ identifier: dto.email, identifierType: 'email' });
    if (!user) {
      throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST, HttpStatus.BAD_REQUEST);
    }

    const token = (await this.otpService.createOtp(user.id)).token;
    await this.emailService.sendForgotPasswordMail(
      user.email,
      user.first_name,
      `${process.env.FRONTEND_URL}/reset-password`,
      token,
    );

    return {
      message: SYS_MSG.EMAIL_SENT,
    };
  }

  async updateForgotPassword(updatePasswordDto: UpdatePasswordDto) {
    const { email, newPassword, otp } = updatePasswordDto;

    const exists = await this.userService.getUserRecord({ identifier: email, identifierType: 'email' });
    if (!exists) throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST, HttpStatus.NOT_FOUND);

    const user = await this.otpService.retrieveUserAndOtp(exists.id, otp);
  }

  async changePassword(user_id: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.getUserRecord({
      identifier: user_id,
      identifierType: 'id',
    });

    if (!user) {
      throw new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomHttpException(SYS_MSG.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    await this.userService.updateUserRecord({
      updatePayload: { password: newPassword },
      identifierOptions: {
        identifierType: 'id',
        identifier: user.id,
      },
    });

    return {
      message: SYS_MSG.PASSWORD_UPDATED,
    };
  }

  async loginUser(loginDto: LoginDto): Promise<LoginResponseDto | { status_code: number; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.getUserRecord({
      identifier: email,
      identifierType: 'email',
    });

    if (!user) {
      throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    const access_token = this.jwtService.sign({ id: user.id, sub: user.id });
    const responsePayload = {
      access_token,
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          // is_superadmin: isSuperAdmin,
        },
      },
    };

    return { message: SYS_MSG.LOGIN_SUCCESSFUL, ...responsePayload };
  }

  async googleAuth(googleAuthPayload: GoogleAuthPayload) {
    const idToken = googleAuthPayload.id_token;

    if (!idToken) {
      throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const request = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);

    if (request.status === 400) {
      throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    if (request.status === 500) {
      throw new CustomHttpException(SYS_MSG.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const verifyTokenResponse: TokenPayload = await request.json();

    const userEmail = verifyTokenResponse.email;
    const userExists = await this.userService.getUserRecord({ identifier: userEmail, identifierType: 'email' });

    if (!userExists) {
      const userCreationPayload = {
        email: userEmail,
        first_name: verifyTokenResponse.given_name || '',
        last_name: verifyTokenResponse?.family_name || '',
        password: '',
        profile_pic_url: verifyTokenResponse?.picture || '',
      };
      return await this.createUserGoogle(userCreationPayload);
    }

    // const userOranisations = await this.organisationService.getAllUserOrganisations(userExists.id, 1, 10);
    // const isSuperAdmin = userOranisations.map((instance) => instance.user_role).includes('super-admin');
    const accessToken = this.jwtService.sign({
      sub: userExists.id,
      id: userExists.id,
      email: userExists.email,
      first_name: userExists.first_name,
      last_name: userExists.last_name,
    });

    return {
      message: SYS_MSG.LOGIN_SUCCESSFUL,
      access_token: accessToken,
      data: {
        user: {
          id: userExists.id,
          email: userExists.email,
          first_name: userExists.first_name,
          last_name: userExists.last_name,
          // is_superadmin: isSuperAdmin,
        },
      },
    };
  }

  public async createUserGoogle(userPayload: CreateUserDTO) {
    const newUser = await this.userService.createUser(userPayload);
    const newOrganisationPaload = {
      name: `${newUser.first_name}'s Organisation`,
      description: '',
      email: newUser.email,
      industry: '',
      type: '',
      country: '',
      address: '',
      state: '',
    };

    const accessToken = this.jwtService.sign({
      sub: newUser.id,
      id: newUser.id,
      email: userPayload.email,
      first_name: userPayload.first_name,
      last_name: userPayload.last_name,
    });
    return {
      status_code: HttpStatus.CREATED,
      message: SYS_MSG.USER_CREATED,
      access_token: accessToken,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          // is_superadmin: isSuperAdmin,
        },
      },
    };
  }

  async requestSignInToken(requestSignInTokenDto: RequestSigninTokenDto) {
    const { email } = requestSignInTokenDto;

    const user = await this.userService.getUserRecord({ identifier: email, identifierType: 'email' });

    if (!user) {
      throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const otpExist = await this.otpService.findOtp(user.id);

    if (otpExist) {
      await this.otpService.deleteOtp(user.id);
    }

    const otp = await this.otpService.createOtp(user.id);

    await this.emailService.sendLoginOtp(user.email, otp.token);

    return {
      message: SYS_MSG.SIGN_IN_OTP_SENT,
    };
  }

  async verifyToken(verifyOtp: OtpDto) {
    const { token, email } = verifyOtp;

    const user = await this.userService.getUserRecord({ identifier: email, identifierType: 'email' });
    const otp = await this.otpService.verifyOtp(user.id, token);

    if (!user || !otp) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORISED_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.sign({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      sub: user.id,
      id: user.id,
    });

    const { password, ...data } = user;
    const responsePayload = {
      ...data,
    };

    return {
      message: SYS_MSG.LOGIN_SUCCESSFUL,
      access_token: accessToken,
      data: responsePayload,
    };
  }
}

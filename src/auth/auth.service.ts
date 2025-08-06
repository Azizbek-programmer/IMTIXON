import { 
  BadRequestException, 
  ConflictException, 
  ForbiddenException, 
  Injectable, 
  NotFoundException, 
  ServiceUnavailableException, 
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Roles, User } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SigninUserDto } from '../user/dto/signin-user.dto';
import { Status } from '../../generated/prisma';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly mailService: MailService,
  ) {}

  private async generateTokens(user: User) {
    const payload:JwtPayload = { id: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { email, password, confirm_password, full_name, phone, role, language_id } = createUserDto;

      if (password !== confirm_password) {
        throw new BadRequestException('Parollar mos emas');
      }

      const existingUser = await this.prismaService.user.findFirst({
        where: { OR: [{ email }, { phone }] },
      });
      if (existingUser) {
        throw new ConflictException('Bunday foydalanuvchi allaqachon mavjud');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const activationLink = uuidv4();

      const newUser = await this.prismaService.user.create({
        data: {
          email,
          full_name,
          phone,
          role: Roles.CUSTOMER,
          password: hashedPassword,
          activationLink: activationLink,
          is_verified: false,
          status: Status.INACTIVE,
          language_id
        },
      });

      try {
        await this.mailService.sendMail(newUser);
      } catch (error) {
        console.error('Email yuborishda xatolik:', error);
        throw new ServiceUnavailableException('Email yuborishda xatolik yuz berdi');
      }

      return {
        statusCode: 201,
        message: 'Royxatdan otdingiz. Email orqali akkauntni faollashtiring.',
        userId: newUser.id,
      };
    } catch (error) {
      throw error;
    }
  }

  async activateAccount(link: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { activationLink: link },
      });

      if (!user) throw new NotFoundException('Aktivatsiya havolasi notogri yoki eskirgan');

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { is_verified: true },
      });

      return { message: 'Akkaunt muvaffaqiyatli faollashtirildi' };
    } catch (error) {
      throw error;
    }
  }

  async signIn(signInUserDto: SigninUserDto, res: Response) {
    try {
      const { email, password } = signInUserDto;
      const user = await this.prismaService.user.findUnique({ where: { email } });

      if (!user) throw new UnauthorizedException('Bunday foydalanuvchi mavjud emas');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Email yoki parol notogri');

      if (!user.is_verified) {
        throw new UnauthorizedException('Akkaunt hali faollashtirilmagan');
      }

      const { accessToken, refreshToken } = await this.generateTokens(user);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          hashedRefreshToken,
          status: Status.ACTIVE,
        },
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: Number(process.env.COOKIE_TIME) || 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return {
        statusCode: 200,
        message: 'Foydalanuvchi tizimga kirdi',
        userId: user.id,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async signOut(userId: number, res: Response) {
    try {
       const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

      if (!user) throw new ForbiddenException('User topilmadi');

      await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          status: Status.INACTIVE,
        },
      });

      return {
        statusCode: 200,
        message: 'User logged out successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token notogri yoki eskirgan');
    }
  }

  async refresh_token(userId: number, refreshToken: string, res: Response) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id: userId } });
      if (!user || !user.hashedRefreshToken) throw new UnauthorizedException('User topilmadi');

      const rtMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!rtMatches) throw new UnauthorizedException('Refresh token notogri');

      const tokens = await this.generateTokens(user);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { hashedRefreshToken },
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: +process.env.COOKIE_TIME!,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return {
        statusCode: 200,
        message: 'Tokenlar yangilandi',
        userId: user.id,
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Token yangilashda xatolik');
    }
  }
}

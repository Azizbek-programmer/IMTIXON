import { 
  BadRequestException, 
  ConflictException, 
  ForbiddenException, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SigninUserDto } from '../user/dto/signin-user.dto';
import { Status } from '../../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  private async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role };

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

  async createSuperAdmin() {
    try {
      const superAdmin = await this.usersService.createSuperAdminData();
      if (!superAdmin) return;

      const { accessToken, refreshToken } = await this.generateTokens(superAdmin);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.prismaService.user.update({
        where: { id: superAdmin.id },
        data: { hashedRefreshToken },
      });

      return {
        statusCode: 201,
        message: 'Super Admin yaratildi',
        superAdminId: superAdmin.id,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Super Admin yaratishda xatolik');
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);

      return {
        statusCode: 201,
        message: 'Yangi foydalanuvchi muvaffaqiyatli yaratildi (inactive)',
        userId: newUser.id,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Sign Up vaqtida xatolik');
    }
  }

  async signIn(signInUserDto: SigninUserDto, res: Response) {
    try {
      const { email, password } = signInUserDto;
      const user = await this.prismaService.user.findUnique({ where: { email } });

      if (!user) throw new UnauthorizedException('Bunday foydalanuvchi mavjud emas');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Email yoki parol notogri');

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
      throw new UnauthorizedException(error.message || 'Sign In vaqtida xatolik');
    }
  }

  async signOut(refreshToken: string, res: Response) {
    try {
      const userData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!userData) throw new ForbiddenException('User topilmadi');

      await this.usersService.updateRefreshToken(userData.id, '');
      res.clearCookie('refreshToken');

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

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AuthGuard
  extends PassportAuthGuard('access-jwt')
  implements CanActivate
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req: Request | any = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride('ispublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token mavjud emas');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token notogri formatda');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Token tekshirishda xatolik');
    }

    if (!payload) {
      throw new UnauthorizedException('Token notogri');
    }
// console.log("========>>>>>>>>>>>>", payload.is_verified);
// console.log(":::::::::::>>>>", payload);

    if (!payload.is_verified) {
      throw new ForbiddenException('Siz faol foydalanuvchi emassiz');
    }

    req.user = payload;

    const passportResult = await super.canActivate(context);
    return !!passportResult;
  }
}

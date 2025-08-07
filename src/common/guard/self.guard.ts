import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'generated/prisma';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request | any = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = Number(request.params.id);

    if (!user) {
      throw new ForbiddenException('Foydalanuvchi aniqlanmadi');
    }

    if (user.role === Roles.SUPERADMIN) {
      return true;
    }

    if (targetUserId && user.id === targetUserId) {
      return true;
    }

    throw new ForbiddenException(
      'Siz faqat ozingizning malumotlaringizga kira olasiz',
    );
  }
}

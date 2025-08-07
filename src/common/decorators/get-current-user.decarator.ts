import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload, JwtPayloadRefresgToken } from '../types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadRefresgToken, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    // console.log(user);
    // console.log(data);

    if (!user) {
      throw new ForbiddenException("token notog'ri");
    }
    if (!data) {
      return data;
    }
    // console.log('user', user);

    return user[data];
  },
);

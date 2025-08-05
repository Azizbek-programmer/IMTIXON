// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '../../prisma/prisma.service';
// import { User, Status } from '../../../generated/prisma';

// interface JwtPayload {
//   id: number;
//   email: string;
//   role: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly config: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: config.get<string>('ACCESS_TOKEN_KEY'),
//     });
//   }

//   async validate(payload: JwtPayload): Promise<User> {
//     const user = await this.prisma.user.findUnique({ where: { id: payload.id } });

//     if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');
//     if (!user.is_verified) throw new UnauthorizedException('Akkaunt hali faollashtirilmagan');
//     if (user.status === Status.INACTIVE) throw new UnauthorizedException('Akkaunt faol emas');

//     return user; // req.user ga yoziladi
//   }
// }

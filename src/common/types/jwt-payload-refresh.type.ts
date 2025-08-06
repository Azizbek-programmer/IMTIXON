import { JwtPayload } from './jwtpayload';

export type JwtPayloadRefresgToken = JwtPayload & { refreshToken: string };

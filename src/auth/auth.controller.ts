import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../user/dto/signin-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import type { Response } from 'express';
import { AuthGuard, RfreshTokenGuard } from 'src/common/guard';
import { ResposeFields } from 'src/common/types';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('auth')
@UseGuards( RoleGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  // @Roles('SUPERADMIN', 'ADMIN', 'CUSTOMER')
  @HttpCode(200)
  @Post('signIn')
  signIn(
    @Body() signInUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInUserDto, res);
  }

  @HttpCode(200)
  @HttpCode(HttpStatus.OK)
  @Post('signOut/:id')
  signOut(
    @GetCurrentUserId() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(+id, res);
  }

  @UseGuards(RfreshTokenGuard)
  @HttpCode(200)
  @Post('refresh')
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResposeFields> {
    return this.authService.refresh_token(userId, refreshToken, res);
  }

  @Get('activate/:link')
  async activate(@Param('link') link: string) {
    return this.authService.activateAccount(link);
  }
}

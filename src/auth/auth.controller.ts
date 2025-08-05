import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../user/dto/signin-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CookieGetter } from '../common/decorators/cookie-geter.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('signIn')
  signIn(
    @Body() signInUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInUserDto, res);
  }

  @HttpCode(200)
  @Post('signOut')
  signOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({passthrough: true}) res: Response
  ) {
    return this.authService.signOut(refreshToken, res)
  }

  @HttpCode(200)
  @Post('refresh/:id')
  refresh(
    @Param('id', ParseIntPipe) id: number,
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh_token(id, refreshToken, res);
  }

    @Get('activate/:link')
  async activate(@Param('link') link: string) {
    return this.authService.activateAccount(link);
  }
}

import { Controller, Get, Request, Post, UseGuards, Body, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateUserDto } from './users/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }

  @Post('auth/register')
  async register(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return { status: HttpStatus.CREATED, data: { "message": "User created successfully" } }
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

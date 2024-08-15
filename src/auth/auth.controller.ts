import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.createUser(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('todos')
  findAll() {
    return this.authService.findAll();
  }

  @Get('saludo')
  @Auth()
  saludo() {
    return 'Hola';
  }
}

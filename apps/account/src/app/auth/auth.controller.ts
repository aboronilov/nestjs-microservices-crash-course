import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    await this.authService.register(registerDTO);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    // await this.authService.login(registerDTO)
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDTO extends LoginDto {
  displayName?: string;
}

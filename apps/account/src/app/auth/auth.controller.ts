import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccountLogin,
  AccountRegister,
} from '@nest-microservices-purple/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() registerDTO: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return await this.authService.register(registerDTO);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
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

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@nest-microservices-purple/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@nest-microservices-purple/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: AccountRegister.Request) {
    const userExists = await this.userRepository.findUser(email);
    if (userExists) {
      throw new Error(`User with email ${email} allready exists`);
    }

    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Wrong credentials');
    }

    const userEntity = new UserEntity(user);
    const isValid = await userEntity.validatePassword(password);
    if (!isValid) {
      throw new Error('Wrong credentials');
    }

    return { id: user._id };
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}

import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findUser(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async deleteUser(email: string) {
    return await this.userModel.deleteOne({ email }).exec();
  }
}

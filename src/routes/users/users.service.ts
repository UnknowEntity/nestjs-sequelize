import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './interfaces/user.interface';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private usersRepository: typeof UserModel,
  ) {}

  async findAll() {
    return this.usersRepository.findAll({ raw: true });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id }, raw: true });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.destroy({ where: { id } });
  }

  async addOne(createUserDto: CreateUserDto): Promise<number> {
    return (await this.usersRepository.create({ ...createUserDto })).id;
  }

  @Interval(100000)
  cleanTrash() {
    console.log('clean the trash');
  }
}

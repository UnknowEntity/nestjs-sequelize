import { CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    CacheModule.register({ ttl: 300 }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

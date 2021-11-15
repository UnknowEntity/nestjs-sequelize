import {
  Body,
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { User } from './user.model';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('users.get')
  @Get()
  async findAll() {
    return plainToClass(User, this.usersService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return plainToClass(User, this.usersService.findOne(id));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const insertId = await this.usersService.addOne(createUserDto);
    this.cacheManager.del('users.get');
    return { insertId };
  }

  @Post('login')
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { body } = request;
    const user = await this.usersService.findOne(body.id);
    if (user.password === body.password) {
      response.status(200).cookie('token', `12345${user.id}`, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
        sameSite: true,
      });
      return { userId: user.id };
    }

    return { userId: -1 };
  }
}

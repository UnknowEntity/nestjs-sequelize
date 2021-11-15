import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ErrorsInterceptor } from 'src/interceptors/errors.interceptor';
import { CacheInterceptor } from '../../interceptors/cached.interceptor';
import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor';
import { GetRequestUser } from 'src/decorators/user.decorator';

@Roles('user')
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Roles('admin', 'monitor')
  @UseGuards(RolesGuard)
  async create(@Body() createCatDto: CreateCatDto) {
    return createCatDto;
  }

  @Get()
  @UseInterceptors(TransformInterceptor, CacheInterceptor)
  async findAll() {
    return this.catsService.findAll();
  }

  @Get('timeout')
  @UseInterceptors(TimeoutInterceptor)
  async timeoutMethod() {
    const delayTime = Math.random() > 0.5 ? 3000 : 0;
    await new Promise((resolve) => setTimeout(resolve, delayTime));
    return { result: 'succeed' };
  }

  @Get('error')
  @UseInterceptors(ErrorsInterceptor)
  async errorMethod() {
    throw new NotFoundException();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @GetRequestUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: any,
  ) {
    return this.catsService.findOne(id);
  }
}

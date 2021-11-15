import { Controller, Get, Query } from '@nestjs/common';
import { CacheManagerService } from './cacheManager.service';

@Controller('system-info')
export class CacheManagerController {
  constructor(private cacheManager: CacheManagerService) {}

  @Get()
  getCache(@Query('key') key: string) {
    console.log(key);
    const cache = this.cacheManager.getCache(key);
    console.log(cache);
    return cache;
  }
}

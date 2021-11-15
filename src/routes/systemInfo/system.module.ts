import { CacheModule, Module } from '@nestjs/common';
import { CacheManagerController } from './cacheManager.controller';
import { CacheManagerService } from './cacheManager.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [CacheManagerController],
  providers: [CacheManagerService],
})
export class SystemModule {}

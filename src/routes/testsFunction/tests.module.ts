import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import {
  EventEmitterSevice,
  QueueService,
  TaskConsumer,
  TaskSchedulingService,
} from './tests.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'task' })],
  providers: [
    EventEmitterSevice,
    TaskSchedulingService,
    QueueService,
    TaskConsumer,
  ],
  controllers: [TestsController],
})
export class TestsModule {}

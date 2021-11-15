import { Body, Controller, Post } from '@nestjs/common';
import { EventDto, TaskDto } from './tests.interface';
import {
  EventEmitterSevice,
  QueueService,
  TaskSchedulingService,
} from './tests.service';

@Controller('tests')
export class TestsController {
  constructor(
    private taskSchedulingService: TaskSchedulingService,
    private eventEmitterService: EventEmitterSevice,
    private queueService: QueueService,
  ) {}

  @Post('event-happening')
  eventHappening(@Body() { message, time }: EventDto) {
    const emitEvent = () => {
      this.eventEmitterService.emitEvent(message);
    };
    this.taskSchedulingService.createCronJob(
      `${Math.random()}`,
      new Date(Date.now() + time),
      emitEvent,
    );
  }

  @Post('add-task')
  async addTask(@Body() { serial, message, time }: TaskDto) {
    const job = await this.queueService.addJob(serial, message, time);
    console.log(
      `Added job successfully!!!\nJob's ID: ${job.id}\nJob's serial: ${serial}`,
    );
    return { message: 'task added', serial, jobNumber: job.id };
  }
}

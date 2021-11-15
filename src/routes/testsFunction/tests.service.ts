import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueDrained,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { CronJob } from 'cron';
import { EventEmitter2 } from 'eventemitter2';
import { JobTask } from './tests.interface';

@Injectable()
export class TaskSchedulingService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  createCronJob(name: string, time: Date, event: () => void) {
    const job = new CronJob(time, () => {
      event();
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}

@Injectable()
export class EventEmitterSevice {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(message: string) {
    this.eventEmitter.emit('notify with email', message);
  }

  @OnEvent('notify with email')
  notifyWithEmail(message: string) {
    console.log(message);
  }
}

@Injectable()
export class QueueService {
  constructor(@InjectQueue('task') private taskQueue: Queue) {}

  async addJob(serial: number, message: string, time: number) {
    return await this.taskQueue.add({ serial, message, time });
  }
}

@Processor('task')
export class TaskConsumer {
  @Process()
  async transcode(job: Job<JobTask>) {
    const { data } = job;
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log(
          `Job's serial #${data.serial} was executed.\nMessage: ${data.message}`,
        );
        resolve('RESOLVED');
      }, data.time),
    );
    return { value: Math.floor(Math.random() * 10000) };
  }

  @OnQueueActive()
  onActive(job: Job<JobTask>) {
    const { data } = job;
    console.log(
      `Processing job ${job.id} of serial ${data.serial} with message ${data.message}...`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job<JobTask>, result: { value: number }) {
    const { data } = job;
    console.log(
      `Complete job ${job.id} of serial ${data.serial} with message ${data.message}\nThe value is ${result.value}`,
    );
  }
  @OnQueueDrained()
  onFinishedAllTask() {
    console.log('ALL FINISHED');
  }
}

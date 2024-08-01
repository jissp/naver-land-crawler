import { Module } from '@nestjs/common';
import { CrawlerQueueModule } from '@modules/crawler-queue/crawler-queue.module';
import { Schedule } from './schedules';

@Module({
    imports: [CrawlerQueueModule],
    providers: [Schedule],
})
export class SchedulerModule {}

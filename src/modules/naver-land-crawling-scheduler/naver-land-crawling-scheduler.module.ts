import { Module } from '@nestjs/common';
import { CrawlerQueueModule } from '@modules/crawler-queue/crawler-queue.module';
import { NaverLandCrawlingScheduler } from './naver-land-crawling.scheduler';

@Module({
    imports: [CrawlerQueueModule],
    providers: [NaverLandCrawlingScheduler],
})
export class NaverLandCrawlingSchedulerModule {}

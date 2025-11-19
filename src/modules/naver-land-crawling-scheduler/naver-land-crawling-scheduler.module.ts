import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { NaverLandQueue } from '@modules/naver-land-crawler';
import { NaverLandCrawlingScheduler } from './naver-land-crawling.scheduler';

const queueTypes = [NaverLandQueue.CrawlingArticles];

@Module({
    imports: [QueueModule.forFeature(queueTypes)],
    providers: [
        ...QueueModule.getQueueProviders(queueTypes),
        NaverLandCrawlingScheduler,
    ],
})
export class NaverLandCrawlingSchedulerModule {}

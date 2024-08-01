import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { NaverLandQueue } from './crawler-queue.interface';
import { CrawlerQueueService } from './crawler-queue.service';

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes: [
                NaverLandQueue.CrawlingArticles,
                NaverLandQueue.ArticleTransform,
                NaverLandQueue.CoordinateToAddress,
            ],
        }),
    ],
    providers: [CrawlerQueueService],
    exports: [CrawlerQueueService],
})
export class CrawlerQueueModule {}

import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { NaverLandFrontModule } from '@modules/naver-land-front';
import { NaverLandClusterModule } from '@modules/naver-land-cluster';
import { Coord2addressModule } from '@modules/coord2address';
import { ArticleModule } from '@modules/article';
import { ArticleKeyModule } from '@modules/article-key';
import { BasicInfoModule } from '@modules/basic-info';
import { ComplexModule } from '@modules/complex';
import { ComplexEvStationModule } from '@modules/complex-ev-station';
import { NaverLandQueue } from './naver-land-crawler.interface';
import {
    ArticleTransformProcessor,
    CoordToAddressProcessor,
    CrawlingArticleProcessor,
} from './processors';

const queueTypes = [
    NaverLandQueue.CrawlingArticles,
    NaverLandQueue.ArticleTransform,
    NaverLandQueue.CoordinateToAddress,
];
const processors = [
    CrawlingArticleProcessor,
    ArticleTransformProcessor,
    CoordToAddressProcessor,
];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

@Module({
    imports: [
        QueueModule.forFeature(queueTypes),
        ArticleKeyModule,
        BasicInfoModule,
        ComplexModule,
        ComplexEvStationModule,
        ArticleModule,
        Coord2addressModule,
        NaverLandFrontModule,
        NaverLandClusterModule,
    ],
    providers: [...queueProviders, ...processors],
})
export class NaverLandCrawlerModule {}

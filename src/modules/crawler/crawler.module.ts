import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NaverLandFrontModule } from '@modules/naver-land-front';
import { NaverLandClusterModule } from '@modules/naver-land-cluster';
import {
    ArticleKeyEntity,
    BasicInfoEntity,
    ComplexEntity,
    ComplexEvStationEntity,
} from './entities';
import { CrawlerQueueModule } from '@modules/crawler-queue';
import { ArticleModule } from '@modules/article';
import { Coord2addressModule } from '@modules/coord2address';
import {
    ArticleKeyService,
    BasicInfoService,
    ComplexEvStationService,
    ComplexService,
} from './services';
import {
    ArticleTransformProcessor,
    CoordToAddressProcessor,
    CrawlingArticleProcessor,
} from './processors';

const entities = [
    ArticleKeyEntity,
    BasicInfoEntity,
    ComplexEntity,
    ComplexEvStationEntity,
];
const services = [
    ArticleKeyService,
    BasicInfoService,
    ComplexService,
    ComplexEvStationService,
];
const processes = [
    CrawlingArticleProcessor,
    ArticleTransformProcessor,
    CoordToAddressProcessor,
];

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        ArticleModule,
        Coord2addressModule,
        CrawlerQueueModule,
        NaverLandFrontModule,
        NaverLandClusterModule,
    ],
    providers: [...processes, ...services],
    exports: [...services],
})
export class CrawlerModule {}

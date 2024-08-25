import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import {
    ArticleKeyEntity,
    BasicInfoEntity,
    ComplexEntity,
    ComplexEvStationEntity,
} from './entities';
import { NaverLandClientModule } from '@modules/naver-land-client';
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
        NaverLandClientModule,
        ArticleModule,
        Coord2addressModule,
        CrawlerQueueModule,
    ],
    providers: [...processes, ...services],
    exports: [...services],
})
export class CrawlerModule {}

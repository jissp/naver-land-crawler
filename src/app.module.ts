import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from '@modules/queue';
import { NaverLandCrawlerModule } from '@modules/naver-land-crawler';
import { NaverLandCrawlingSchedulerModule } from '@modules/naver-land-crawling-scheduler';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return configService.get<TypeOrmModuleOptions>('database');
            },
        }),
        QueueModule.forRoot(),
        ScheduleModule.forRoot(),
        NaverLandCrawlingSchedulerModule,
        NaverLandCrawlerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

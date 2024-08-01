import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './configuration';
import { QueueModule } from '@modules/queue';
import { SchedulerModule } from '@modules/scheduler';
import { CrawlerModule } from '@modules/crawler';

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
        SchedulerModule,
        CrawlerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

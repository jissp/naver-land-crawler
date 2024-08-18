import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { SlackConfigs } from './slack.interface';
import { SlackService } from './slack.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: WebClient,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { oAuthToken } = configService.get<SlackConfigs>('slack');

                return new WebClient(oAuthToken);
            },
        },
        SlackService,
    ],
    exports: [SlackService],
})
export class SlackModule {}

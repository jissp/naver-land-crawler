import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { SlackConfigs } from './slack.interface';
import { getSlackClientToken } from './slack.decorator';

@Module({})
export class SlackModule {
    public static forRoot(): DynamicModule {
        const webClientProvider = {
            provide: getSlackClientToken(),
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { oAuthToken } = configService.get<SlackConfigs>('slack');

                return new WebClient(oAuthToken);
            },
        };

        return {
            global: true,
            module: SlackModule,
            imports: [ConfigModule],
            providers: [webClientProvider],
            exports: [webClientProvider],
        };
    }
}

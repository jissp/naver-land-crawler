import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../configuration';
import { SlackChannelId, SlackModule, SlackService } from '@modules/slack';

describe('Slack Test', () => {
    let slackWebApiService: SlackService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                SlackModule,
            ],
        }).compile();

        slackWebApiService = module.get<SlackService>(SlackService);
    });

    it('SendMessage1', async () => {
        await slackWebApiService.postMessage(
            SlackChannelId.NaverLandCrawling,
            'zzz',
        );
    });
});

import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../configuration';
import { SlackChannelId, SlackModule } from '@modules/slack';
import { WebClient } from '@slack/web-api';
import { getSlackClientToken } from '@modules/slack/slack.decorator';

describe('Slack Test', () => {
    let slackWebClient: WebClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                SlackModule.forRoot(),
            ],
        }).compile();

        slackWebClient = module.get<WebClient>(getSlackClientToken());
    });

    describe('메세지 전송 테스트', () => {
        it('존재하지 않는 채널로 메세지 전송', async () => {
            await expect(async () => {
                await slackWebClient.chat.postMessage({
                    channel: 'NotExistingChannel',
                    text: '테스트 메세지입니다.',
                });
            }).rejects.toThrowError('An API error occurred: channel_not_found');
        });

        it('존재하는 채널로 메세지 전송', async () => {
            const response = await slackWebClient.chat.postMessage({
                channel: SlackChannelId.NaverLandCrawling,
                text: '테스트 메세지입니다.',
            });

            expect(response.ok).toBeTruthy();
        });
    });
});

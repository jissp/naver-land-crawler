import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackChatOptions } from '@modules/slack/slack.interface';

@Injectable()
export class SlackService {
    constructor(private readonly webClient: WebClient) {}

    /**
     * @param channelId
     * @param message
     * @param options
     */
    public async postMessage(
        channelId: string,
        message: string,
        options?: SlackChatOptions,
    ) {
        return this.webClient.chat.postMessage({
            channel: channelId,
            text: message,
            ...options,
        });
    }
}

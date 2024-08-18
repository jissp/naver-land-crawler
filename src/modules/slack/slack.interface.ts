import { IConfiguration } from '../../configuration';

export type SlackConfigs = IConfiguration['slack'];

export enum SlackChannelId {
    NaverLandCrawling = 'C07GWTAU7PH',
}

export interface SlackChatOptions {
    username?: string;
    iconUrl?: string;
}
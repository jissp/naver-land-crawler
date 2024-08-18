import { Inject } from '@nestjs/common';

export function getSlackClientToken() {
    return 'SlackWebClient';
}

export const InjectSlackClient = () => Inject('SlackWebClient');

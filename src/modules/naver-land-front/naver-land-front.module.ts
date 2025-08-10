import { Module } from '@nestjs/common';
import { NaverLandFrontClient } from './naver-land-front.client';

const sharedProviders = [NaverLandFrontClient];

@Module({
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class NaverLandFrontModule {}

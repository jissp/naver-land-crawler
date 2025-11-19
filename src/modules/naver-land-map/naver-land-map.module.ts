import { Module } from '@nestjs/common';
import { NaverLandMapClient } from './naver-land-map.client';

const sharedProviders = [NaverLandMapClient];

@Module({
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class NaverLandMapModule {}

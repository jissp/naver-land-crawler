import { Module } from '@nestjs/common';
import { NaverLandClusterClient } from './naver-land-cluster.client';

const sharedProviders = [NaverLandClusterClient];

@Module({
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class NaverLandClusterModule {}

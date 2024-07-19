import { Module } from '@nestjs/common';
import { NaverLandClusterClient, NaverLandFrontClient } from './clients';

const clients = [NaverLandClusterClient, NaverLandFrontClient];

@Module({
    providers: [...clients],
    exports: [...clients],
})
export class NaverLandClientModule {}

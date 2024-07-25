import { Module } from '@nestjs/common';
import {
    NaverLandClusterClient,
    NaverLandFrontClient,
    NaverLandMapClient,
} from './clients';

const clients = [
    NaverLandClusterClient,
    NaverLandFrontClient,
    NaverLandMapClient,
];

@Module({
    providers: [...clients],
    exports: [...clients],
})
export class NaverLandClientModule {}

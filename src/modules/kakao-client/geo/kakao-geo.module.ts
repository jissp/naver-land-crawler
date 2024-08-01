import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KakaoGeoClient } from './kakao-geo.client';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: KakaoGeoClient,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return new KakaoGeoClient(
                    await configService.get('kakao_rest_api_key'),
                );
            },
        },
    ],
    exports: [KakaoGeoClient],
})
export class KakaoGeoModule {}

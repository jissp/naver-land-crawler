import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoGeoModule } from '@modules/kakao-client/geo';
import { KakaoGeoAddressEntity } from './kakao-geo-address.entity';
import { Coord2addressService } from './coord2address.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([KakaoGeoAddressEntity]),
        KakaoGeoModule,
    ],
    providers: [Coord2addressService],
    exports: [Coord2addressService],
})
export class Coord2addressModule {}

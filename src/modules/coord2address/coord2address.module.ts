import { Module } from '@nestjs/common';
import { KakaoGeoModule } from '@modules/kakao-client/geo';
import { KakaoGeoAddressModule } from '@modules/kakao-geo-address';
import { Coord2addressService } from './coord2address.service';

@Module({
    imports: [KakaoGeoModule, KakaoGeoAddressModule],
    providers: [Coord2addressService],
    exports: [Coord2addressService],
})
export class Coord2addressModule {}

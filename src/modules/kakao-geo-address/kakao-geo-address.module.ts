import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoGeoAddressEntity } from '@modules/kakao-geo-address/kakao-geo-address.entity';
import { KakaoGeoAddressService } from '@modules/kakao-geo-address/kakao-geo-address.service';

@Module({
    imports: [TypeOrmModule.forFeature([KakaoGeoAddressEntity])],
    providers: [KakaoGeoAddressService],
    exports: [KakaoGeoAddressService],
})
export class KakaoGeoAddressModule {}

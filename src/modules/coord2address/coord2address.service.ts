import { Injectable } from '@nestjs/common';
import { KakaoGeoClient } from '@modules/kakao-client/geo';
import { KakaoGeoAddressService } from '@modules/kakao-geo-address';
import { Coordinate } from './coord2address.interface';

@Injectable()
export class Coord2addressService {
    constructor(
        private readonly kakaoGeoClient: KakaoGeoClient,
        private readonly kakaoGeoAddressService: KakaoGeoAddressService,
    ) {}

    /**
     * @param coordinate
     */
    public async findByCoordWithCollect(coordinate: Coordinate) {
        const kakaoGeoAddress =
            await this.kakaoGeoAddressService.findByCoord(coordinate);
        if (kakaoGeoAddress) {
            return kakaoGeoAddress;
        }

        return this.collectCoordToAddress(coordinate);
    }

    /**
     * 경도, 위도에 해당하는 주소지를 수집한다.
     * @param coordinate
     */
    public async collectCoordToAddress(coordinate: Coordinate) {
        const kakaoAddress = await this.callKakaoCoord2addressApi(coordinate);

        return this.kakaoGeoAddressService.upsertCoord(
            coordinate,
            kakaoAddress,
        );
    }

    /**
     * 경도 위도로 주소를 조회하는 Kakao API를 호출한다.
     * @param coordinate
     */
    public async callKakaoCoord2addressApi(coordinate: Coordinate) {
        const response = await this.kakaoGeoClient.getAddressByCoord({
            lat: coordinate.lat,
            long: coordinate.lng,
        });

        return response.documents[0];
    }
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@modules/common/types';
import { KakaoGeoClient } from '@modules/kakao-client/geo';
import { KakaoGeoAddressEntity } from './kakao-geo-address.entity';
import { Coordinate } from './coord2address.interface';

@Injectable()
export class Coord2addressService {
    constructor(
        private readonly kakaoGeoClient: KakaoGeoClient,
        @InjectRepository(KakaoGeoAddressEntity)
        private readonly kakaoGeoAddressRepository: Repository<KakaoGeoAddressEntity>,
    ) {}

    /**
     * @param coordinate
     */
    public async findByCoord(
        coordinate: Coordinate,
    ): Promise<Nullable<KakaoGeoAddressEntity>> {
        return await this.kakaoGeoAddressRepository.findOneBy({
            latitude: coordinate.lat,
            longitude: coordinate.lng,
        });
    }

    /**
     * @param coordinate
     */
    public async findByCoordWithCollect(
        coordinate: Coordinate,
    ): Promise<Nullable<KakaoGeoAddressEntity>> {
        const kakaoGeoAddress = await this.findByCoord(coordinate);
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

        const kakaoGeoAddress = this.kakaoGeoAddressRepository.create({
            latitude: coordinate.lat,
            longitude: coordinate.lng,
            data: kakaoAddress,
        });

        return this.kakaoGeoAddressRepository.save<KakaoGeoAddressEntity>(
            kakaoGeoAddress,
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

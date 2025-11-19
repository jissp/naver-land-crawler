import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@common/types';
import { Coordinate } from '@modules/coord2address';
import { IGetAddressByCoord2Response } from '@modules/kakao-client/geo';
import { KakaoGeoAddressEntity } from './kakao-geo-address.entity';

@Injectable()
export class KakaoGeoAddressService {
    constructor(
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

    public upsertCoord(
        coordinate: Coordinate,
        kakaoAddress: IGetAddressByCoord2Response['documents'][number],
    ) {
        const kakaoGeoAddress = this.kakaoGeoAddressRepository.create({
            latitude: coordinate.lat,
            longitude: coordinate.lng,
            data: kakaoAddress,
        });

        return this.kakaoGeoAddressRepository.save<KakaoGeoAddressEntity>(
            kakaoGeoAddress,
        );
    }
}

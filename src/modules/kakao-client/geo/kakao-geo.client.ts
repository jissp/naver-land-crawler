import axios, { Axios } from 'axios';
import { Injectable } from '@nestjs/common';
import { IGetAddressByCoord2Response } from './kakao-geo.interface';

@Injectable()
export class KakaoGeoClient {
    private readonly client: Axios;

    constructor(apiKey: string) {
        this.client = axios.create({
            baseURL: 'https://dapi.kakao.com',
            headers: {
                Authorization: `KakaoAK ${apiKey}`,
            },
        });
    }

    /**
     * 지정 경도/위도의 주소 정보를 조회한다.
     * @param long
     * @param lat
     */
    public async getAddressByCoord({
        long,
        lat,
    }: {
        long: number;
        lat: number;
    }): Promise<IGetAddressByCoord2Response> {
        const response = await this.client.get(
            '/v2/local/geo/coord2address.JSON',
            {
                params: {
                    x: long,
                    y: lat,
                },
            },
        );

        return response.data;
    }
}

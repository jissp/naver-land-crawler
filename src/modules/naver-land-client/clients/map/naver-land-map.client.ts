import { Injectable } from '@nestjs/common';
import { GetRegionListResponseDto } from './dtos';
import { NaverLandClientAbstract } from '../naver-land.client.abstract';

@Injectable()
export class NaverLandMapClient extends NaverLandClientAbstract {
    constructor() {
        super('https://m.land.naver.com');
    }

    /**
     *
     * @param cortarNo
     */
    public async getRegionList(
        cortarNo: string,
    ): Promise<GetRegionListResponseDto> {
        return this.call<GetRegionListResponseDto>({
            method: 'GET',
            path: '/map/getRegionList',
            queryParams: {
                cortarNo,
            },
        });
    }
}

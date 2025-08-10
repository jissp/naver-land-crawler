import { Injectable } from '@nestjs/common';
import { NaverLandClientAbstract } from '@common/naver-land';
import { GetRegionListResponseDto } from './dtos';

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

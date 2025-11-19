import { Test } from '@nestjs/testing';
import {
    NaverLandMapClient,
    NaverLandMapModule,
} from '@modules/naver-land-map';

describe('NaverLandMapClient', () => {
    let naverLandMapClient: NaverLandMapClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [NaverLandMapModule],
        }).compile();

        naverLandMapClient = module.get<NaverLandMapClient>(NaverLandMapClient);
    });

    it('getRegionList', async () => {
        const response = await naverLandMapClient.getRegionList('1156000000');

        expect(response.result).toBeDefined();
    });
});

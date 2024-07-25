import { Test } from '@nestjs/testing';
import { NaverLandClientModule } from '../../../naver-land-client.module';
import { NaverLandMapClient } from '../naver-land-map.client';

describe('NaverLandMapClient', () => {
    let naverLandMapClient: NaverLandMapClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [NaverLandClientModule],
        }).compile();

        naverLandMapClient = module.get<NaverLandMapClient>(NaverLandMapClient);
    });

    it('getRegionList', async () => {
        const response = await naverLandMapClient.getRegionList('1156000000');

        expect(response.result).toBeDefined();
    });
});

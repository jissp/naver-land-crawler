import { Test } from '@nestjs/testing';
import { NaverLandClientModule } from '../../../naver-land-client.module';
import { NaverLandFrontClient } from '../naver-land-front.client';
import {
    RealEstateTypeCode,
    TradeType,
} from '../../../naver-land-client.interface';

describe('NaverLandFrontClient', () => {
    let naverLandFrontClient: NaverLandFrontClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [NaverLandClientModule],
        }).compile();

        naverLandFrontClient =
            module.get<NaverLandFrontClient>(NaverLandFrontClient);
    });

    it('getArticleKey', async () => {
        const response = await naverLandFrontClient.getArticleKey('2429861377');

        expect(response.isSuccess).toBeDefined();
        expect(response.result).toBeDefined();
    });

    it('getArticleBasicInfo', async () => {
        const response = await naverLandFrontClient.getArticleBasicInfo({
            articleId: '2429861377',
            realEstateType: RealEstateTypeCode.오피스텔,
            tradeType: TradeType.매매,
        });

        expect(response.isSuccess).toBeDefined();
        expect(response.result).toBeDefined();
    });

    it('getComplex', async () => {
        const response = await naverLandFrontClient.getComplex('127997');

        expect(response.isSuccess).toBeDefined();
        expect(response.result).toBeDefined();
    });
});

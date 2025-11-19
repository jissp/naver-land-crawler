import { Test } from '@nestjs/testing';
import {
    NaverLandClusterClient,
    NaverLandClusterModule,
    SearchRealEstateTypeCode,
} from '@modules/naver-land-cluster';
import { TradeType } from '@common/naver-land';

describe('NaverLandClusterClient', () => {
    let naverLandClusterClient: NaverLandClusterClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [NaverLandClusterModule],
        }).compile();

        naverLandClusterClient = module.get<NaverLandClusterClient>(
            NaverLandClusterClient,
        );
    });

    it('getArticleList', async () => {
        const articles = await naverLandClusterClient.getArticleList({
            rletTpCd: [
                SearchRealEstateTypeCode.아파트,
                SearchRealEstateTypeCode.오피스텔,
            ],
            tradTpCd: [TradeType.매매, TradeType.월세],
            z: 19,
            lat: 37.5236987,
            lon: 126.8992539,
            btm: 37.522901,
            lft: 126.8958207,
            top: 37.5244964,
            rgt: 126.9026871,
            spcMin: 33,
            spcMax: 900000000,
            dprcMax: 40000,
            wprcMax: 10000,
            page: 1,
        });

        expect(articles.code).toBe('success');
        expect(articles.body).toBeDefined();
    });
});

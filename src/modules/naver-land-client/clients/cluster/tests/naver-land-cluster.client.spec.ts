import { Test } from '@nestjs/testing';
import { NaverLandClientModule } from '../../../naver-land-client.module';
import { NaverLandClusterClient } from '../naver-land-cluster.client';

describe('NaverLandClusterClient', () => {
    let naverLandClusterClient: NaverLandClusterClient;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [NaverLandClientModule],
        }).compile();

        naverLandClusterClient = module.get<NaverLandClusterClient>(
            NaverLandClusterClient,
        );
    });

    it('getArticleList', async () => {
        const articles = await naverLandClusterClient.getArticleList({
            rletTpCd: 'APT:OPST',
            tradTpCd: 'A1:B2',
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
        });

        expect(articles.code).toBe('success');
        expect(articles.body).toBeDefined();
    });
});

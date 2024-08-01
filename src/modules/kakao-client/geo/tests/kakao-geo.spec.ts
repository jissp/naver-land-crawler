import { Test } from '@nestjs/testing';
import { KakaoGeoClient, KakaoGeoModule } from '@modules/kakao-client/geo';

describe('카카오 로컬 API Test', () => {
    let kakaoGeoApiClient: KakaoGeoClient;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [KakaoGeoModule],
        }).compile();

        kakaoGeoApiClient = moduleRef.get<KakaoGeoClient>(KakaoGeoClient);
    });

    it('좌표 변환', async () => {
        const response = await kakaoGeoApiClient.getAddressByCoord({
            lat: 37.5030847,
            long: 126.996848,
        });

        expect(response.documents[0].address.address_name).toBe(
            '서울 서초구 반포동 18-1',
        );
    });
});

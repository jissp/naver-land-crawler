import { Injectable } from '@nestjs/common';
import {
    RealEstateTypeCode,
    TradeType,
} from '../../naver-land-client.interface';
import { FrontApiResponseDto } from './dtos';
import { FrontApiOperationId } from './naver-land-front.interface';
import { NaverLandClientAbstract } from '../naver-land.client.abstract';

@Injectable()
export class NaverLandFrontClient extends NaverLandClientAbstract {
    constructor() {
        super('https://fin.land.naver.com');
    }

    /**
     * 매물의 연관 키를 조회합니다.
     * @param articleId
     */
    public async getArticleKey(
        articleId: number | string,
    ): Promise<FrontApiResponseDto<FrontApiOperationId.ArticleKey>> {
        return this.call<FrontApiResponseDto<FrontApiOperationId.ArticleKey>>({
            method: 'GET',
            path: '/front-api/v1/article/key',
            queryParams: {
                articleId,
            },
        });
    }

    /**
     * 매물의 상세 정보를 조회합니다.
     * @param articleId
     * @param realEstateType
     * @param tradeType
     */
    public async getArticleBasicInfo({
        articleId,
        realEstateType,
        tradeType,
    }: {
        articleId: number | string;
        realEstateType: RealEstateTypeCode;
        tradeType: TradeType;
    }): Promise<FrontApiResponseDto<FrontApiOperationId.ArticleBasicInfo>> {
        return this.call<
            FrontApiResponseDto<FrontApiOperationId.ArticleBasicInfo>
        >({
            method: 'GET',
            path: '/front-api/v1/article/basicInfo',
            queryParams: {
                articleId,
                realEstateType,
                tradeType,
            },
        });
    }

    /**
     * 매물의 단지 정보를 조회합니다.
     * @param complexNumber
     */
    public async getComplex(
        complexNumber: number | string,
    ): Promise<FrontApiResponseDto<FrontApiOperationId.Complex>> {
        return this.call<FrontApiResponseDto<FrontApiOperationId.Complex>>({
            method: 'GET',
            path: '/front-api/v1/complex',
            queryParams: {
                complexNumber,
            },
        });
    }
}

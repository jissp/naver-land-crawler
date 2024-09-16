import {
    ArticleListRequestDto,
    SearchRealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';

export enum CortarNo {
    서울시구로구 = '1153000000',
    서울시영등포구 = '1156000000',
    서울시금천구 = '1154500000',
    서울시양천구신정동 = '1147010100',
    서울시마포구 = '1144000000',
    서울시용산구 = '1117000000',
    서울시관악구 = '1162000000',
    서울시동작구 = '1159000000',
    서울시서초구 = '1165000000',
    서울시강남구 = '1168000000',
    서울시강동구 = '1174000000',
    서울시송파구 = '1171000000',
    서울시광진구자양동 = '1121510500',
    서울시성동구성수동1가 = '1120011400',
    서울시성동구성수동2가 = '1120011500',
    서울시중구 = '1114000000',
    경기도광명시광명동 = '4121010100',
    경기도광명시철산동 = '4121010200',
    경기도성남시분당구 = '4113500000',
    경기도과천시 = '4129000000',

    //
    경기도광진구 = '1121500000',
    경기도구리시 = '4131000000',
}

export type ArticleCondition = Partial<ArticleListRequestDto>;

export type ArticleConditionsGroupedByTradeType = {
    [key in TradeType]?: ArticleCondition[];
};

export type ArticleConditionsGroupedByRealEstateType = {
    [key in SearchRealEstateTypeCode]?: ArticleConditionsGroupedByTradeType;
};

/**
 * cortarNoList에 등록된 지역들에 대해서 기본으로 조회할 조건을 정의합니다.
 */
export const DefaultCrawlingConditions: ArticleConditionsGroupedByRealEstateType =
    {
        [SearchRealEstateTypeCode.아파트]: {
            [TradeType.매매]: [
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    dprcMin: 15000,
                    dprcMax: 40000,
                },
            ],
            [TradeType.월세]: [
                {
                    // 보증금 적게 / 월세는 많게
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 1000,
                    wprcMax: 8000,
                    rprcMin: 50,
                    rprcMax: 140,
                },
                {
                    // 보증금 많게 / 월세는 적게
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 8000,
                    wprcMax: 15000,
                    rprcMin: 20,
                    rprcMax: 64,
                },
            ],
        },
        [SearchRealEstateTypeCode.오피스텔]: {
            [TradeType.매매]: [
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    dprcMin: 10000,
                    dprcMax: 40000,
                },
            ],
            [TradeType.월세]: [
                {
                    // 보증금 적게 / 월세는 많게
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 1000,
                    wprcMax: 5000,
                    rprcMin: 50,
                    rprcMax: 120,
                },
                {
                    // 보증금 많게 / 월세는 적게
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 5000,
                    wprcMax: 12000,
                    rprcMin: 30,
                    rprcMax: 60,
                },
            ],
        },
        [SearchRealEstateTypeCode.단독_다가구]: {
            [TradeType.매매]: [
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    dprcMin: 15000,
                    dprcMax: 50000,
                },
            ],
            [TradeType.전세]: [
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 8000,
                    wprcMax: 20000,
                },
            ],
            [TradeType.월세]: [
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 1000,
                    wprcMax: 5000,
                    rprcMin: 50,
                    rprcMax: 120,
                },
                {
                    spcMin: 33,
                    spcMax: 900000000,
                    wprcMin: 5000,
                    wprcMax: 12000,
                    rprcMin: 20,
                    rprcMax: 60,
                },
            ],
        },
    };

export const CustomCrawlingConditions: {
    [key in CortarNo]?: ArticleConditionsGroupedByRealEstateType;
} = {
    [CortarNo.경기도광진구]: {
        [SearchRealEstateTypeCode.단독_다가구]: DefaultCrawlingConditions.DDDGG,
    },
    [CortarNo.경기도구리시]: {
        [SearchRealEstateTypeCode.단독_다가구]: DefaultCrawlingConditions.DDDGG,
    },
};

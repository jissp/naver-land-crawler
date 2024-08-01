import {
    ArticleListRequestDto,
    SearchRealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';

export const CrawlingConditionMap: {
    [key in SearchRealEstateTypeCode]?: ArticleRequestDtoByTradeType;
} = {
    [SearchRealEstateTypeCode.아파트]: {
        [TradeType.매매]: {
            spcMin: 33,
            dprcMin: 20000,
            dprcMax: 40000,
        },
        [TradeType.월세]: {
            spcMin: 33,
            wprcMin: 1000,
            wprcMax: 10000,
            rprcMin: 60,
            rprcMax: 120,
        },
    },
    [SearchRealEstateTypeCode.오피스텔]: {
        [TradeType.매매]: {
            spcMin: 36,
            dprcMin: 10000,
            dprcMax: 36000,
        },
        [TradeType.월세]: {
            spcMin: 33,
            wprcMin: 1000,
            wprcMax: 5000,
            rprcMin: 60,
            rprcMax: 100,
        },
    },
    [SearchRealEstateTypeCode.단독_다가구]: {
        [TradeType.매매]: {
            spcMin: 36,
            dprcMin: 20000,
            dprcMax: 40000,
        },
        [TradeType.월세]: {
            spcMin: 36,
            wprcMin: 1000,
            wprcMax: 5000,
            rprcMin: 60,
            rprcMax: 100,
        },
    },
};

export type ArticleRequestDtoByTradeType = {
    [key in TradeType]?: Partial<ArticleListRequestDto>;
};

export const cortarNoList = [
    '1153000000', // 구로구
    '1156000000', // 영등포구
    '1144000000', // 마포구
    '1154500000', // 금천구
    '1162000000', // 관악구
    '1159000000', // 동작구
    '1165000000', // 서초구
    '1168000000', // 강남구
    '1171000000', // 송파구
    '1120011400', // 성동구 성수동1가
    '1120011500', // 성동구 성수동2가
    '1114000000', // 서울시 중구
    '4113500000', // 경기도 성남시 분당구
];

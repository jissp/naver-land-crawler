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
            spcMax: 900000000,
            dprcMin: 15000,
            dprcMax: 40000,
        },
        [TradeType.월세]: {
            spcMin: 33,
            spcMax: 900000000,
            wprcMin: 1000,
            wprcMax: 15000,
            rprcMin: 30,
            rprcMax: 150,
        },
    },
    [SearchRealEstateTypeCode.오피스텔]: {
        [TradeType.매매]: {
            spcMin: 33,
            spcMax: 900000000,
            dprcMin: 10000,
            dprcMax: 40000,
        },
        [TradeType.월세]: {
            spcMin: 33,
            spcMax: 900000000,
            wprcMin: 1000,
            wprcMax: 10000,
            rprcMin: 30,
            rprcMax: 130,
        },
    },
    [SearchRealEstateTypeCode.단독_다가구]: {
        [TradeType.매매]: {
            spcMin: 33,
            spcMax: 900000000,
            dprcMin: 15000,
            dprcMax: 50000,
        },
        [TradeType.월세]: {
            spcMin: 33,
            spcMax: 900000000,
            wprcMin: 1000,
            wprcMax: 15000,
            rprcMin: 10,
            rprcMax: 150,
        },
    },
};

export type ArticleRequestDtoByTradeType = {
    [key in TradeType]?: Partial<ArticleListRequestDto>;
};

export const cortarNoList = [
    '1153000000', // 서울시 구로구
    '1156000000', // 서울시 영등포구
    '1154500000', // 서울시 금천구
    '1147010100', // 서울시 양천구 신정동
    '1144000000', // 서울시 마포구
    '1117000000', // 서울시 용산구
    '1162000000', // 서울시 관악구
    '1159000000', // 서울시 동작구
    '1165000000', // 서울시 서초구
    '1168000000', // 서울시 강남구
    '1174000000', // 서울시 강동구
    '1171000000', // 서울시 송파구
    '1121510500', // 서울시 광진구 자양동
    '1120011400', // 서울시 성동구 성수동1가
    '1120011500', // 서울시 성동구 성수동2가
    '1114000000', // 서울시 중구
    '4121010100', // 경기도 광명시 광명동
    '4121010200', // 경기도 광명시 철산동
    '4113500000', // 경기도 성남시 분당구
    '4129000000', // 경기도 과천시
];

import {
    SearchRealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';

export class ArticleListRequestDto {
    z!: number;
    lat!: number;
    lon!: number;
    btm!: number;
    lft!: number;
    top!: number;
    rgt!: number;
    cortarNo?: string; // 법정동코드
    rletTpCd?: SearchRealEstateTypeCode;
    tradTpCd?: TradeType;
    spcMin?: number; // 면적(최소)
    spcMax?: number; // 면적(최대)
    dprcMin?: number; // 매매가(최소)
    dprcMax?: number; // 매매가(최대)
    wprcMin?: number; // 보증금(최소)
    wprcMax?: number; // 보증금(최대)
    rprcMin?: number; // 월세(최소)
    rprcMax?: number; // 월세(최대)
    page: number;
}

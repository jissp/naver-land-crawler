import { RealEstateTypeCode, TradeType } from '@modules/naver-land-client';

export enum SearchRealEstateTypeCode {
    아파트 = 'APT',
    오피스텔 = 'OPST',
    단독_다가구 = 'DDDGG',
    전원주택 = 'JWJT',
}

export enum RealEstateTypeName {
    '아파트' = '아파트',
    '오피스텔' = '오피스텔',
    '빌라' = '빌라',
    '아파트분양권' = '아파트분양권',
    '오피스텔분양권' = '오피스텔분양권',
    '재건축' = '재건축',
    '전원주택' = '전원주택',
    '단독/다가구' = '단독/다가구',
    '상가주택' = '상가주택',
    '한옥주택' = '한옥주택',
    '재개발' = '재개발',
    '원룸' = '원룸',
    '고시원' = '고시원',
    '상가' = '상가',
    '사무실' = '사무실',
    '공장/창고' = '공장/창고',
    '건물' = '건물',
    '토지' = '토지',
    '지식산업센터' = '지식산업센터',
}

export type Tags = DuplexTag | RoomTag | CompletionYearTag;

export enum DuplexTag {
    복층 = '복층',
}

export enum RoomTag {
    방한개 = '방한개',
    방두개 = '방두개',
    방세개 = '방세개',
    방네개이상 = '방네개이상',
}

export enum CompletionYearTag {
    '2년이내' = '2년이내',
    '4년이내' = '4년이내',
    '10년이내' = '10년이내',
    '15년이내' = '15년이내',
    '25년이내' = '25년이내',
    '25년이상' = '25년이상',
    '30년이상' = '30년이상',
}

export interface ArticleItem {
    atclNo: string; // '2435257506';
    cortarNo: string; // '1156011300';
    atclNm: string; // '더하우스';
    atclStatCd: string; // 'R0';
    rletTpCd: RealEstateTypeCode; // 'A02';
    uprRletTpCd: string; // 'A02';
    rletTpNm: RealEstateTypeName;
    tradTpCd: TradeType; // 'B2';
    tradTpNm: string; // '월세';
    vrfcTpCd: string; // 'OWNER';
    flrInfo: string; // '7/10';
    prc: number; // 5000;
    rentPrc: number; // 150;
    hanPrc: string; // '5,000';
    spc1: string; // '46';
    spc2: string; // '29.93';
    direction?: string; // '남향';
    atclCfmYmd: string; // '24.07.17.';
    repImgUrl: string; // '/20240717_27/land_naver_17212155634169wpKB_JPEG/1707982294352.jpg';
    repImgTpCd: string; // '10';
    repImgThumb: string; // 'f130_98';
    lat: number; // 37.523586;
    lng: number; // 126.901218;
    atclFetrDesc: string; // '2,5호선 더블역세권, 신축, 무융자O, 전망 굿, 대로변';
    tagList: string[]; // ['2년이내', '융자금없는', '역세권'];
    bildNm: string; // '1동';
    minute: number; //0;
    sameAddrCnt: number; // 3;
    sameAddrDirectCnt: number; // 0;
    sameAddrHash: string; // '23A02B2N9584265825e0af1e8723af1fdaf607c3030a4bc4bd0545cf233ee295085fc5a8';
    sameAddrMaxPrc: string; // '5,000';
    sameAddrMaxPrc2: string; // '150';
    sameAddrMinPrc: string; // '5,000';
    sameAddrMinPrc2: string; // '150';
    cpid: string; // 'bizmk';
    cpNm: string; // '매경부동산';
    cpCnt: number; //3;
    rltrNm: string; // '영등포탑부동산공인중개사사무소';
    directTradYn: string; // 'N';
    minMviFee: number; //0;
    maxMviFee: number; //0;
    etRoomCnt: number; //0;
    tradePriceHan: string; // '';
    tradeRentPrice: number; //0;
    tradeCheckedByOwner: boolean; // false;
    cpLinkVO: {
        cpId: string; // 'bizmk';
        mobileArticleLinkTypeCode: string; // 'NONE';
        mobileBmsInspectPassYn: string; // 'Y';
        pcArticleLinkUseAtArticleTitle: boolean; // false;
        pcArticleLinkUseAtCpName: boolean; // false;
        mobileArticleLinkUseAtArticleTitle: boolean; // false;
        mobileArticleLinkUseAtCpName: boolean; // false;
    };
    dtlAddrYn: string; // 'N';
    dtlAddr: string; // '';
}

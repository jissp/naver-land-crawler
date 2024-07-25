export enum CortarType {
    Sec = 'sec',
    Dvsn = 'dvsn',
    City = 'city',
}

export interface CortarItem {
    CortarNo: string;
    CortarNm: string;
    MapXCrdn: string;
    MapYCrdn: string;
    CortarType: CortarType;
}

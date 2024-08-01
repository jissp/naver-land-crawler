export interface IGetAddressByCoord2Response {
    meta: {
        total_count: number;
    };
    documents: IDocument[];
}

export interface IDocument {
    road_address: IRoadAddress;
    address: IAddress;
}

interface ICommonAddress {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
}

export interface IRoadAddress extends ICommonAddress {
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
}

export interface IAddress extends ICommonAddress {
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
}

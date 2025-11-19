import { CortarItem } from '../naver-land-map.interface';

export class GetRegionListResponseDto {
    result: {
        list: CortarItem[];
        dvsnInfo?: CortarItem;
        cityInfo?: CortarItem;
        secInfo?: CortarItem;
    };
}

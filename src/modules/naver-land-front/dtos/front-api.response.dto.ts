import {
    FrontApiOperationId,
    FrontApiResult,
} from '../naver-land-front.interface';

export class FrontApiResponseDto<T extends FrontApiOperationId> {
    isSuccess: boolean;
    result: FrontApiResult<T>;
}

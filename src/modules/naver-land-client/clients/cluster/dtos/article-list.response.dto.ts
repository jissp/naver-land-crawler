import { ArticleItem } from '../naver-land-cluster.interface';

export class ArticleListResponseDto {
    code: string;
    hasPaidPreSale: boolean;
    more: boolean;
    TIME: boolean;
    z: number;
    page: number;
    body: ArticleItem[];
}

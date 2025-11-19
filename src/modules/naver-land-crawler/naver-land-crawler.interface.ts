import {
    ArticleItem,
    ArticleListRequestDto,
} from '@modules/naver-land-cluster';

export enum NaverLandQueue {
    CrawlingArticles = 'CrawlingArticles',
    ArticleTransform = 'ArticleTransform',
    CoordinateToAddress = 'CoordinateToAddress',
}

interface NaverLandQueueJobDataMap {
    [NaverLandQueue.CrawlingArticles]: Partial<ArticleListRequestDto>;
    [NaverLandQueue.ArticleTransform]: ArticleItem;
    [NaverLandQueue.CoordinateToAddress]: CoordinateToAddressJobData;
}

export type NaverLandQueueJobData<T extends NaverLandQueue> =
    T extends keyof NaverLandQueueJobDataMap
        ? NaverLandQueueJobDataMap[T]
        : never;

export interface CoordinateToAddressJobData {
    articleNo: string;
    latitude: number;
    longitude: number;
}

import { ArticleItem, ArticleListRequestDto } from '@modules/naver-land-client';

export enum NaverLandQueue {
    CrawlingArticles = 'CrawlingArticles',
    ArticleTransform = 'ArticleTransform',
    CoordinateToAddress = 'CoordinateToAddress',
}

export type NaverLandQueueJobData<T extends NaverLandQueue> =
    T extends NaverLandQueue.CrawlingArticles
        ? Partial<ArticleListRequestDto>
        : T extends NaverLandQueue.ArticleTransform
          ? ArticleItem
          : T extends NaverLandQueue.CoordinateToAddress
            ? CoordinateToAddressJobData
            : never;

export interface CoordinateToAddressJobData {
    articleNo: string;
    latitude: number;
    longitude: number;
}

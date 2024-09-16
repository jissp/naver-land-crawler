import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { AbstractQueueService } from '@modules/queue';
import {
    NaverLandQueue,
    NaverLandQueueJobData,
} from './crawler-queue.interface';

/**
 * 네이버 부동산 크롤링에 관련된 Queue 서비스
 */
@Injectable()
export class CrawlerQueueService extends AbstractQueueService {
    constructor(
        @InjectQueue(NaverLandQueue.CrawlingArticles)
        crawlingArticleQueue: Queue<NaverLandQueue.CrawlingArticles>,
        @InjectQueue(NaverLandQueue.ArticleTransform)
        articleTransformQueue: Queue<NaverLandQueue.ArticleTransform>,
        @InjectQueue(NaverLandQueue.CoordinateToAddress)
        coordinateToAddressQueue: Queue<NaverLandQueue.CoordinateToAddress>,
    ) {
        super();

        this.queueMap[NaverLandQueue.CrawlingArticles] = crawlingArticleQueue;
        this.queueMap[NaverLandQueue.ArticleTransform] = articleTransformQueue;
        this.queueMap[NaverLandQueue.CoordinateToAddress] =
            coordinateToAddressQueue;
    }

    /**
     * 네이버 부동산 매물 수집 Job을 Queue에 추가한다.
     * @param data
     */
    public async addCrawlingArticleJob(
        data: NaverLandQueueJobData<NaverLandQueue.CrawlingArticles>,
    ) {
        return this._addJob<
            NaverLandQueueJobData<NaverLandQueue.CrawlingArticles>
        >({
            queueType: NaverLandQueue.CrawlingArticles,
            data,
            options: {
                isUniq: true,
            },
        });
    }

    /**
     * 네이버 부동산 매물 변환 Job을 Queue에 추가한다.
     * @param data
     */
    public async addArticleTransformJob(
        data: NaverLandQueueJobData<NaverLandQueue.ArticleTransform>,
    ) {
        return this._addJob<
            NaverLandQueueJobData<NaverLandQueue.ArticleTransform>
        >({
            queueType: NaverLandQueue.ArticleTransform,
            data,
        });
    }

    /**
     * 위도/경도를 주소로 변환하고 네이버 부동산 매물 데이터를 갱신하는 Job을 Queue에 추가한다.
     * @param data
     */
    public async addCoordinateToAddressJob(
        data: NaverLandQueueJobData<NaverLandQueue.CoordinateToAddress>,
    ) {
        return this._addJob<
            NaverLandQueueJobData<NaverLandQueue.CoordinateToAddress>
        >({
            queueType: NaverLandQueue.CoordinateToAddress,
            data,
        });
    }
}

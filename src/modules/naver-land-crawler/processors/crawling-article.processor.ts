import { Job, Queue } from 'bull';
import { Inject } from '@nestjs/common';
import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { uSleep } from '@modules/utils';
import {
    ArticleItem,
    ArticleListRequestDto,
    NaverLandClusterClient,
} from '@modules/naver-land-cluster';
import { NaverLandFrontClient } from '@modules/naver-land-front';
import { ArticleKeyEntity, ArticleKeyService } from '@modules/article-key';
import { BasicInfoService } from '@modules/basic-info';
import { ComplexService } from '@modules/complex';
import { ComplexEvStationService } from '@modules/complex-ev-station';
import { DEFAULT_ARTICLES_PER_PAGE, RATE_LIMIT } from '../constants';
import {
    NaverLandQueue,
    NaverLandQueueJobData,
} from '../naver-land-crawler.interface';

type AreaCoordinateFields = 'z' | 'lat' | 'lon' | 'btm' | 'lft' | 'top' | 'rgt';
type JobData = NaverLandQueueJobData<NaverLandQueue.CrawlingArticles>;

/**
 * 네이버 부동산 매물을 조회하는 프로세서
 */
@Processor(NaverLandQueue.CrawlingArticles)
export class CrawlingArticleProcessor {
    constructor(
        @Inject(NaverLandQueue.ArticleTransform)
        private readonly articleTransformQueue: Queue<
            NaverLandQueueJobData<NaverLandQueue.ArticleTransform>
        >,
        private readonly articleKeyService: ArticleKeyService,
        private readonly basicInfoService: BasicInfoService,
        private readonly complexService: ComplexService,
        private readonly complexEvStationService: ComplexEvStationService,
        private readonly naverLandClusterClient: NaverLandClusterClient,
        private readonly naverLandFrontClient: NaverLandFrontClient,
    ) {}

    private readonly defaultAreaCoordinates: Pick<
        ArticleListRequestDto,
        AreaCoordinateFields
    > = {
        z: 13,
        lat: 37.5283942,
        lon: 126.9758518,
        btm: 37.4780748,
        lft: 126.7561252,
        top: 37.5786796,
        rgt: 127.1955783,
    };

    @Process()
    async onProcess(job: Job<JobData>) {
        const request = job.data;

        for await (const articles of this.getArticles(request)) {
            // Rate Limit 차단을 최소화하기 위해서 API 호출이 끝나면 3초정도 쉬도록 처리
            await uSleep(RATE_LIMIT.BETWEEN_PAGES);

            for (const article of articles) {
                // 부동산 매물의 Key 정보를 수집한다. (하위 정보 수집 시 필요하다.)
                let articleKey = await this.articleKeyService.findByArticleId(
                    article.atclNo,
                );
                if (!articleKey) {
                    articleKey = await this.collectArticleKey(article);
                    await uSleep(RATE_LIMIT.BETWEEN_REQUESTS);
                }

                // 부동산 매물의 정보를 수집한다.
                await this.collectBasicInfoIfNeeded(article);

                // 부동산 매물의 단지 정보를 수집한다.
                if (articleKey.data?.key?.complexNumber) {
                    await this.collectComplexInfo(articleKey);
                }

                // 네이버 부동산 매물 정보를 가공하여 DB에 적재할 Job을 생성한다.
                await this.articleTransformQueue.add(article);
            }
        }
    }

    @OnQueueCompleted()
    async onCompleted(job: Job<JobData>) {
        const request = job.data;

        console.log('completed CrawlingArticles Job', {
            rletTpCd: request.rletTpCd,
            tradTpCd: request.tradTpCd,
            cortarNo: request.cortarNo,
        });
    }

    @OnQueueFailed()
    async onFailed(job: Job<JobData>, e: any) {
        console.log(e);
    }

    /**
     * 네이버 부동산 매물을 조회한다.
     * @param request
     */
    public async *getArticles(
        request: NaverLandQueueJobData<NaverLandQueue.CrawlingArticles>,
    ) {
        let currentPage = 1;

        while (true) {
            const response = await this.naverLandClusterClient.getArticleList({
                ...this.defaultAreaCoordinates,
                ...request,
                page: currentPage++,
            });

            yield response.body;

            if (response.body.length < DEFAULT_ARTICLES_PER_PAGE) {
                break;
            }
        }
    }

    /**
     * 부동산 매물의 Key 정보를 수집한다.
     * @param atclNo
     */
    public async collectArticleKey({ atclNo }: ArticleItem) {
        const response = await this.naverLandFrontClient.getArticleKey(atclNo);

        return this.articleKeyService.save(atclNo, response.result, {
            reload: false,
        });
    }

    private async collectBasicInfoIfNeeded(article: ArticleItem) {
        const isExistBasicInfo = await this.basicInfoService.existBy(
            article.atclNo,
            article.rletTpCd,
            article.tradTpCd,
        );
        if (!isExistBasicInfo) {
            await this.collectBasicInfo(article);
            await uSleep(RATE_LIMIT.BETWEEN_REQUESTS);
        }
    }

    /**
     * 부동산 매물의 기본 정보를 수집한다.
     * @param article
     */
    public async collectBasicInfo({ atclNo, rletTpCd, tradTpCd }: ArticleItem) {
        const response = await this.naverLandFrontClient.getArticleBasicInfo({
            articleId: atclNo,
            realEstateType: rletTpCd,
            tradeType: tradTpCd,
        });

        return this.basicInfoService.save(
            atclNo,
            rletTpCd,
            tradTpCd,
            response.result,
        );
    }

    /**
     * 단지와 관련된 정보들을 수집한다.
     * @param articleKey
     * @private
     */
    private async collectComplexInfo(articleKey: ArticleKeyEntity) {
        const { complexNumber } = articleKey.data.key;

        const complex = await this.collectComplex(complexNumber);
        if (complex) {
            await uSleep(RATE_LIMIT.BETWEEN_REQUESTS);
        }

        const complexEvStation =
            await this.collectComplexEvStation(complexNumber);
        if (complexEvStation) {
            await uSleep(RATE_LIMIT.BETWEEN_REQUESTS);
        }
    }

    /**
     * 단지 기본 정보를 수집한다.
     * @param complexNumber
     */
    public async collectComplex(complexNumber: number) {
        const isExistComplex = await this.complexService.exist(complexNumber);
        if (isExistComplex) {
            return;
        }

        const response =
            await this.naverLandFrontClient.getComplex(complexNumber);

        return this.complexService.save(complexNumber, response.result);
    }

    /**
     * 단지의 전기차 충전 정보를 수집한다.
     * @param complexNumber
     */
    public async collectComplexEvStation(complexNumber: number) {
        const isExistComplex =
            await this.complexEvStationService.exist(complexNumber);
        if (isExistComplex) {
            return;
        }

        const response =
            await this.naverLandFrontClient.getComplexEvStation(complexNumber);

        return this.complexEvStationService.save(
            complexNumber,
            response.result,
        );
    }
}

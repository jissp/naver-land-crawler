import { Job } from 'bull';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { uSleep } from '@modules/utils';
import {
    ArticleItem,
    ArticleListRequestDto,
    NaverLandClusterClient,
    NaverLandFrontClient,
} from '@modules/naver-land-client';
import {
    CrawlerQueueService,
    NaverLandQueue,
    NaverLandQueueJobData,
} from '@modules/crawler-queue';
import {
    ArticleKeyService,
    BasicInfoEntity,
    BasicInfoService,
    ComplexEntity,
    ComplexService,
} from '@modules/crawler';

type AreaCoordinateFields = 'z' | 'lat' | 'lon' | 'btm' | 'lft' | 'top' | 'rgt';
type JobData = NaverLandQueueJobData<NaverLandQueue.CrawlingArticles>;

/**
 * 네이버 부동산 매물을 조회하는 프로세서
 */
@Processor(NaverLandQueue.CrawlingArticles)
export class CrawlingArticleProcessor {
    constructor(
        private readonly crawlerQueueService: CrawlerQueueService,
        private readonly naverLandClusterClient: NaverLandClusterClient,
        private readonly naverLandFrontClient: NaverLandFrontClient,
        private readonly articleKeyService: ArticleKeyService,
        private readonly basicInfoService: BasicInfoService,
        private readonly complexService: ComplexService,
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

        let page = 1;
        while (true) {
            const response = await this.naverLandClusterClient.getArticleList({
                ...this.defaultAreaCoordinates,
                ...request,
                page,
            });

            // Rate Limit 차단을 최소화하기 위해서 API 호출이 끝나면 3초정도 쉬도록 처리
            await uSleep(3000);

            const articles = response.body;
            if (!articles.length) {
                break;
            }

            for (const article of articles) {
                // Article Key 조회
                const articleKey = await this.collectArticleKey(article);
                await uSleep(200);

                // Basic Info 조회
                const basicInfo = await this.collectBasicInfo(article);
                if (basicInfo) {
                    // 수집이 이루어졌다면 200ms 휴식
                    await uSleep(200);
                }

                // 단지 정보 조회
                if (articleKey.data?.key?.complexNumber) {
                    const complex = await this.collectComplex(
                        articleKey.data.key.complexNumber,
                    );

                    // 수집이 이루어졌다면 200ms 휴식
                    if (complex) {
                        await uSleep(200);
                    }
                }

                // 부동산 매물 데이터 변환 Job 추가
                await this.crawlerQueueService.addArticleTransformJob(article);
            }

            if (articles.length < 20) {
                break;
            }

            // 다음 페이지 조회
            page++;
        }
    }

    /**
     * @param article
     * @private
     */
    private async collectArticleKey(article: ArticleItem) {
        const articleKey = await this.articleKeyService.findByArticleId(
            article.atclNo,
        );

        if (articleKey) {
            return articleKey;
        }

        const response = await this.naverLandFrontClient.getArticleKey(
            article.atclNo,
        );

        return this.articleKeyService.create(article.atclNo, response.result);
    }

    /**
     * @param article
     * @private
     */
    private async collectBasicInfo(
        article: ArticleItem,
    ): Promise<BasicInfoEntity | void> {
        const isExistBasicInfo = await this.basicInfoService.existBy(
            article.atclNo,
            article.rletTpCd,
            article.tradTpCd,
        );

        if (isExistBasicInfo) {
            return;
        }

        const response = await this.naverLandFrontClient.getArticleBasicInfo({
            articleId: article.atclNo,
            realEstateType: article.rletTpCd,
            tradeType: article.tradTpCd,
        });

        return this.basicInfoService.create(
            article.atclNo,
            article.rletTpCd,
            article.tradTpCd,
            response.result,
        );
    }

    /**
     * @param complexNumber
     * @private
     */
    private async collectComplex(
        complexNumber: number,
    ): Promise<ComplexEntity | void> {
        const isExistComplex =
            await this.complexService.existByComplexNumber(complexNumber);

        if (isExistComplex) {
            return;
        }

        const response =
            await this.naverLandFrontClient.getComplex(complexNumber);

        return this.complexService.create(complexNumber, response.result);
    }

    // @OnQueueCompleted()
    // async onCompleted(job: Job<JobData>, result: any) {
    //     // console.log(`${NaverLandCrawlerQueueType.TransformArticle} completed`);
    // }

    @OnQueueFailed()
    async onFailed(job: Job<JobData>, e: any) {
        console.log(e);
    }
}

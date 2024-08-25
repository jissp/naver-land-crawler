import { Job } from 'bull';
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
    ComplexEvStationEntity,
    ComplexEvStationService,
    ComplexService,
} from '../';

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
        private readonly complexEvStationService: ComplexEvStationService,
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

        console.log('start CrawlingArticles Job', {
            rletTpCd: request.rletTpCd,
            tradTpCd: request.tradTpCd,
            cortarNo: request.cortarNo,
        });

        let page = 1;
        while (true) {
            const articles = await this.getArticles(request, page);

            // Rate Limit 차단을 최소화하기 위해서 API 호출이 끝나면 3초정도 쉬도록 처리
            await uSleep(3000);

            for (const article of articles) {
                await this.collectArticleAdditionalInfo(article);

                // 네이버 부동산 매물 정보를 가공하여 DB에 적재할 Job을 생성한다.
                await this.crawlerQueueService.addArticleTransformJob(article);
            }

            // 다음 페이지를 조회할 필요가 없다면 반복문 종료
            if (articles.length < 20) {
                break;
            }

            // 다음 페이지 조회
            page++;
        }
    }

    /**
     * 네이버 부동산 매물을 조회한다.
     * @param request
     * @param page
     * @private
     */
    private async getArticles(request: JobData, page: number) {
        const response = await this.naverLandClusterClient.getArticleList({
            ...this.defaultAreaCoordinates,
            ...request,
            page,
        });

        return response.body;
    }

    /**
     * 네이버 부동산 매물의 추가 정보를 조회 및 수집한다.
     * @param article
     * @private
     */
    private async collectArticleAdditionalInfo(article: ArticleItem) {
        // 부동산 매물의 Key 정보를 수집한다. (하위 정보 수집 시 필요하다.)
        const articleKey = await this.collectArticleKey(article);
        if (!articleKey.id) {
            await uSleep(200);
        }

        // 부동산 매물의 정보를 수집한다.
        const basicInfo = await this.collectBasicInfo(article);
        if (basicInfo) {
            // 수집이 이루어졌다면 200ms 휴식
            await uSleep(200);
        }

        // 부동산 매물의 단지 정보를 수집한다.
        if (articleKey.data?.key?.complexNumber) {
            const complex = await this.collectComplex(
                articleKey.data.key.complexNumber,
            );

            // 수집이 이루어졌다면 200ms 휴식
            if (complex) {
                await uSleep(200);
            }

            const complexEvStation = await this.collectComplexEvStation(
                articleKey.data.key.complexNumber,
            );

            // 수집이 이루어졌다면 200ms 휴식
            if (complexEvStation) {
                await uSleep(200);
            }
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

        return this.articleKeyService.create(article.atclNo, response.result, {
            reload: false,
        });
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

    /**
     * @param complexNumber
     * @private
     */
    private async collectComplexEvStation(
        complexNumber: number,
    ): Promise<ComplexEvStationEntity | void> {
        const isExistComplex =
            await this.complexEvStationService.existByComplexNumber(
                complexNumber,
            );

        if (isExistComplex) {
            return;
        }

        const response =
            await this.naverLandFrontClient.getComplexEvStation(complexNumber);

        return this.complexEvStationService.create(
            complexNumber,
            response.result,
        );
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
}

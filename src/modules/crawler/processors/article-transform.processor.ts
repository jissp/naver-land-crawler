import { Job } from 'bull';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import {
    CrawlerQueueService,
    NaverLandQueue,
    NaverLandQueueJobData,
} from '@modules/crawler-queue';
import { ArticleService } from '@modules/article';
import {
    ArticleKeyService,
    ArticleTransformer,
    BasicInfoService,
    ComplexService,
} from '../';

type JobData = NaverLandQueueJobData<NaverLandQueue.ArticleTransform>;

/**
 * 네이버 부동산 매물 Article 정보를 가공해서 DB에 저장하는 프로세서
 */
@Processor(NaverLandQueue.ArticleTransform)
export class ArticleTransformProcessor {
    constructor(
        private readonly crawlerQueueService: CrawlerQueueService,
        private readonly articleKeyService: ArticleKeyService,
        private readonly basicInfoService: BasicInfoService,
        private readonly complexService: ComplexService,
        private readonly articleService: ArticleService,
    ) {}

    @Process()
    async onProcess(job: Job<JobData>) {
        const article = job.data;

        const articleKey = await this.articleKeyService.findByArticleId(
            article.atclNo,
        );
        const basicInfo = await this.basicInfoService.findBy(
            article.atclNo,
            article.rletTpCd,
            article.tradTpCd,
        );
        const complex = await this.findComplex(
            articleKey.data.key.complexNumber,
        );

        const transformer = new ArticleTransformer(
            article,
            basicInfo.data,
            complex?.data,
        );
        const transformedArticle = transformer.transform();

        const updatedArticle =
            await this.articleService.upsert(transformedArticle);

        // 주소 정보가 없다면 경도 / 위도를 이용해서 주소로 변환하도록 추가 처리를 진행한다.
        if (!updatedArticle.address) {
            await this.crawlerQueueService.addCoordinateToAddressJob({
                articleNo: updatedArticle.articleNo,
                latitude: updatedArticle.lat,
                longitude: updatedArticle.lng,
            });
        }
    }

    // @OnQueueCompleted()
    // async onCompleted(job: Job<JobData>, result: any) {
    //     // console.log(`${NaverLandCrawlerQueueType.TransformArticle} completed`);
    // }

    @OnQueueFailed()
    async onFailed(job: Job<JobData>, e: any) {
        console.log(e);
    }

    private findComplex(complexNumber?: number) {
        if (!complexNumber) {
            return null;
        }

        return this.complexService.findByComplexNumber(complexNumber);
    }
}

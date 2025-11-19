import { Job, Queue } from 'bull';
import { Inject } from '@nestjs/common';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ArticleItem } from '@modules/naver-land-cluster';
import { ArticleService } from '@modules/article';
import { ArticleKeyService } from '@modules/article-key';
import { BasicInfoService } from '@modules/basic-info';
import { ComplexService } from '@modules/complex';
import { ComplexEvStationService } from '@modules/complex-ev-station';
import {
    NaverLandQueue,
    NaverLandQueueJobData,
} from '../naver-land-crawler.interface';
import { ArticleTransformer } from '../article.transformer';

type JobData = NaverLandQueueJobData<NaverLandQueue.ArticleTransform>;

/**
 * 네이버 부동산 매물 Article 정보를 가공해서 DB에 저장하는 프로세서
 */
@Processor(NaverLandQueue.ArticleTransform)
export class ArticleTransformProcessor {
    constructor(
        @Inject(NaverLandQueue.CoordinateToAddress)
        private readonly coordinateToAddressQueue: Queue<
            NaverLandQueueJobData<NaverLandQueue.CoordinateToAddress>
        >,
        private readonly articleKeyService: ArticleKeyService,
        private readonly basicInfoService: BasicInfoService,
        private readonly complexService: ComplexService,
        private readonly complexEvStationService: ComplexEvStationService,
        private readonly articleService: ArticleService,
    ) {}

    @Process()
    async onProcess(job: Job<JobData>) {
        const article = job.data;

        const articleKey = await this.articleKeyService.findByArticleId(
            article.atclNo,
        );
        const { complexNumber } = articleKey.data.key;

        const [basicInfo, complex, complexEvStation] = await Promise.all([
            this.findBasicInfoByArticle(article),
            this.complexService.find(complexNumber),
            this.complexEvStationService.find(complexNumber),
        ]);

        const articleTransformer = new ArticleTransformer(
            article,
            basicInfo.data,
            complex?.data,
            complexEvStation?.data,
        );
        const transformedArticle = articleTransformer.transform();
        const updatedArticle =
            await this.articleService.upsert(transformedArticle);

        // 주소 정보가 없다면 경도 / 위도를 이용해서 주소로 변환하도록 추가 처리를 진행한다.
        if (!updatedArticle.address) {
            await this.coordinateToAddressQueue.add({
                articleNo: updatedArticle.articleNo,
                latitude: updatedArticle.lat,
                longitude: updatedArticle.lng,
            });
        }
    }

    @OnQueueFailed()
    async onFailed(job: Job<JobData>, e: any) {
        console.log(e);
    }

    private async findBasicInfoByArticle({
        atclNo,
        rletTpCd,
        tradTpCd,
    }: ArticleItem) {
        return this.basicInfoService.findBy(atclNo, rletTpCd, tradTpCd);
    }
}

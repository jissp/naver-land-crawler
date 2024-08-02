import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    ArticleRequestDtoByTradeType,
    cortarNoList,
    CrawlingConditionMap,
    RunOnce,
} from '@modules/scheduler';
import {
    ArticleListRequestDto,
    SearchRealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';
import { CrawlerQueueService } from '@modules/crawler-queue';

type CrawlingConditionEntry = [
    realEstateTypeCode: SearchRealEstateTypeCode,
    articleRequestDtoGroup: ArticleRequestDtoByTradeType,
];

type SubCrawlingConditionEntry = [
    tradeType: TradeType,
    request: Partial<ArticleListRequestDto>,
];

@Injectable()
export class Schedule {
    constructor(private readonly crawlerQueueService: CrawlerQueueService) {}

    async onModuleInit() {
        await this.crawlingNaverLandArticles();
    }

    @Cron('0 0 */2 * * *')
    @RunOnce()
    public async crawlingNaverLandArticles() {
        for (const [
            realEstateTypeCode,
            articleRequestDtoGroup,
        ] of Object.entries(CrawlingConditionMap) as CrawlingConditionEntry[]) {
            try {
                await Promise.all(
                    Object.entries(articleRequestDtoGroup).map(
                        async ([
                            tradeType,
                            request,
                        ]: SubCrawlingConditionEntry) => {
                            // 지역별 처리는 어떤걸 먼저 하든 상관없기 때문에 비동기로 동시에 요청
                            await Promise.all(
                                cortarNoList.map(async (cortarNo) =>
                                    this.crawlerQueueService.addCrawlingArticlesJob(
                                        {
                                            cortarNo,
                                            ...request,
                                            rletTpCd: realEstateTypeCode,
                                            tradTpCd: tradeType,
                                        },
                                    ),
                                ),
                            );
                        },
                    ),
                );
            } catch (error) {
                console.log(error);
            }
        }
    }
}

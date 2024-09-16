import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    ArticleConditionsGroupedByRealEstateType,
    ArticleConditionsGroupedByTradeType,
    CortarNo,
    CustomCrawlingConditions,
    DefaultCrawlingConditions,
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
    articleRequestDtoGroup: ArticleConditionsGroupedByTradeType,
];

type SubCrawlingConditionEntry = [
    tradeType: TradeType,
    request: Partial<ArticleListRequestDto>[],
];

@Injectable()
export class Schedule {
    private readonly cortarNoList = [
        CortarNo.서울시구로구,
        CortarNo.서울시영등포구,
        CortarNo.서울시금천구,
        CortarNo.서울시양천구신정동,
        CortarNo.서울시마포구,
        CortarNo.서울시용산구,
        CortarNo.서울시관악구,
        CortarNo.서울시동작구,
        CortarNo.서울시서초구,
        CortarNo.서울시강남구,
        CortarNo.서울시강동구,
        CortarNo.서울시송파구,
        CortarNo.서울시광진구자양동,
        CortarNo.서울시성동구성수동1가,
        CortarNo.서울시성동구성수동2가,
        CortarNo.서울시중구,
        CortarNo.경기도광명시광명동,
        CortarNo.경기도광명시철산동,
        CortarNo.경기도성남시분당구,
        CortarNo.경기도과천시,
    ];

    constructor(private readonly crawlerQueueService: CrawlerQueueService) {}

    async onModuleInit() {
        await this.crawlingNaverLandArticles();
    }

    @Cron('0 0 */3 * * *')
    @RunOnce()
    public async crawlingNaverLandArticles() {
        // 일반 매물 수집
        await Promise.all(
            this.cortarNoList.map(async (cortarNo) => {
                return this.mapConditionsWithCortarNo(
                    cortarNo,
                    DefaultCrawlingConditions,
                );
            }),
        );

        // 커스텀 매물 수집
        Object.entries(CustomCrawlingConditions).map(
            async ([cortarNo, groupedArticleConditions]: [
                CortarNo,
                ArticleConditionsGroupedByRealEstateType,
            ]) => {
                return this.mapConditionsWithCortarNo(
                    cortarNo,
                    groupedArticleConditions,
                );
            },
        );
    }

    /**
     * @param cortarNo
     * @param groupedArticleConditions
     * @private
     */
    private mapConditionsWithCortarNo(
        cortarNo: CortarNo,
        groupedArticleConditions: ArticleConditionsGroupedByRealEstateType,
    ) {
        const entries = Object.entries(
            groupedArticleConditions,
        ) as CrawlingConditionEntry[];

        entries.map(async ([realEstateTypeCode, conditions]) => {
            return this.mapAddCrawlingArticleJobByConditions(
                cortarNo,
                realEstateTypeCode,
                conditions,
            );
        });
    }

    /**
     *
     * @param cortarNo
     * @param realEstateTypeCode
     * @param conditions
     * @private
     */
    private mapAddCrawlingArticleJobByConditions(
        cortarNo: CortarNo,
        realEstateTypeCode: SearchRealEstateTypeCode,
        conditions: ArticleConditionsGroupedByTradeType,
    ) {
        return Object.entries(conditions).map(
            async ([
                tradeType,
                articleListRequestDto,
            ]: SubCrawlingConditionEntry) => {
                return articleListRequestDto.map(
                    async (articleListRequestDto) =>
                        this.crawlerQueueService.addCrawlingArticleJob({
                            ...articleListRequestDto,
                            cortarNo,
                            rletTpCd: realEstateTypeCode,
                            tradTpCd: tradeType,
                        }),
                );
            },
        );
    }
}

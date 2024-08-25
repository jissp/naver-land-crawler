import {
    ArticleItem,
    CompletionYearTag,
    DuplexTag,
    FrontApiOperationId,
    FrontApiResult,
    RoomTag,
    TradeType,
} from '@modules/naver-land-client';
import { Nullable } from '@modules/common/types';
import { ArticleEntity } from '@modules/article/article.entity';
import { numberRange, NumberRangeOption } from '@modules/utils';

export class ArticleTransformer {
    constructor(
        private readonly article: ArticleItem,
        private readonly basicInfo: FrontApiResult<FrontApiOperationId.ArticleBasicInfo>,
        private readonly complex?: FrontApiResult<FrontApiOperationId.Complex>,
        private readonly complexEvStation?: FrontApiResult<FrontApiOperationId.ComplexEvStation>,
    ) {}

    /**
     * 매물 정보를 DB Entity로 변환한다.
     */
    public transform() {
        const article = new ArticleEntity();

        this.buildArticleInfo(article);
        this.buildArticleRoom(article);
        this.buildArticlePrice(article);
        this.buildArticleBuilding(article);
        this.buildArticleParkingInfo(article);
        this.buildArticleEvStationInfo(article);
        this.buildArticleTags(article);

        this.correctNumberFieldRange(article);

        return article;
    }

    /**
     * 매물의 기본 정보를 변환한다.
     * @param article
     * @private
     */
    private buildArticleInfo(article: ArticleEntity) {
        article.articleNo = this.article.atclNo;
        article.articleNo = this.article.atclNo;
        article.atclNm = this.article.atclNm;
        article.rletTpNm = this.article.rletTpNm;
        article.tradTpCd = this.article.tradTpCd;
        article.summary = this.article.atclFetrDesc;
        if (this.basicInfo) {
            const { articleFeatureDescription, articleDescription } =
                this.basicInfo.detailInfo.articleDetailInfo;
            article.summary = articleFeatureDescription;
            article.description = articleDescription;
        }

        const household =
            this.complex?.totalHouseholdNumber ??
            this.basicInfo?.detailInfo.facilityInfo.householdNumber;
        article.household = household ?? 0;
    }

    /**
     * 매물의 방 정보를 변환한다.
     * @private
     */
    private buildArticleRoom(article: ArticleEntity) {
        article.spc1 = Number(this.article.spc1);
        article.spc2 = Number(this.article.spc2);
        article.spcRatio =
            article.spc1 === 0 || article.spc2 === 0
                ? 0
                : (article.spc2 / article.spc1) * 100;
        article.isDuplex = this.extractDuplex();
        article.roomCount = this.extractRoomCount();
        article.direction = this.article.direction;
    }

    /**
     * 매물의 가격 정보를 변환한다.
     * @private
     */
    private buildArticlePrice(article: ArticleEntity) {
        article.price = this.article.prc;
        article.rentPrice = this.article.rentPrc;

        // 매매 / 전세인 경우 평당 가격을 계산한다.
        if ([TradeType.매매, TradeType.전세].includes(article.tradTpCd)) {
            article.spcPrice = article.spc2 ? article.price / article.spc2 : 0;
        }

        /*
         * 전세 / 월세인 경우 보증금을 전월세비율에 맞게 월세로 변환하여 매달 얼마 지출되는지 계산하여 저장한다.
         * 전월세비율 - https://kosis.kr/statHtml/statHtml.do?orgId=408&tblId=DT_30404_N0010
         */
        if ([TradeType.전세, TradeType.월세].includes(article.tradTpCd)) {
            // 보증금을 전월세비율에 맞게 변환한다.
            const transRatio = 5.1;
            const transRentPrice = ((this.article.prc / 100) * transRatio) / 12;

            // 매달 지출되는 환산 월세액을 저장한다.
            article.totalRentPrice = this.article.rentPrc + transRentPrice;

            // 평당 월세액을 계산한다.
            article.spcPrice = article.spc2
                ? article.totalRentPrice / article.spc2
                : 0;
        }
    }

    /**
     * 매물의 건물 정보를 변환한다.
     * @param article
     * @private
     */
    private buildArticleBuilding(article: ArticleEntity) {
        const { floor, maxFloor } = this.extractFloor();

        article.floor = floor ? Number(floor) : null;
        article.maxFloor = maxFloor ? Number(maxFloor) : null;
        article.completionYear = this.extractCompletionYear();

        article.lat = this.article.lat;
        article.lng = this.article.lng;

        this.transformBuildingCoverage(article);
    }

    /**
     * 용적률 / 건폐율을 변환한다.
     * @private
     */
    private transformBuildingCoverage(article: ArticleEntity) {
        if (this.complex) {
            article.buildingCoverageRatio =
                this.complex?.buildingRatioInfo.buildingCoverageRatio ?? null;
            article.floorAreaRatio =
                this.complex?.buildingRatioInfo.floorAreaRatio ?? null;
        } else {
            article.buildingCoverageRatio =
                this.basicInfo?.detailInfo.sizeInfo.buildingCoverageRatio ??
                null;
            article.floorAreaRatio =
                this.basicInfo?.detailInfo.sizeInfo.floorAreaRatio ?? null;
        }
    }

    /**
     * 매물의 주차 정보를 변환한다.
     */
    private buildArticleParkingInfo(article: ArticleEntity) {
        article.parkingCount =
            (this.basicInfo?.detailInfo.facilityInfo.totalParkingCount ??
                this.complex?.parkingInfo.totalParkingCount) ||
            0;
        article.parkingRatio =
            (this.basicInfo?.detailInfo.facilityInfo.parkingCountPerHousehold ??
                this.complex?.parkingInfo.parkingCountPerHousehold) ||
            0;

        // 주차대수 비율이 0인데 세대수 정보가 존재할 경우 주차대수 비율을 수동으로 계산한다.
        if (article.parkingRatio === 0 && article.household !== 0) {
            article.parkingRatio = article.parkingCount / article.household;
        }
    }

    /**
     * 단지 내 전기차 충전 시설 정보를 변환한다.
     * @param article
     * @private
     */
    private buildArticleEvStationInfo(article: ArticleEntity) {
        article.evStationCount = this.complexEvStation?.count ?? 0;
    }

    /**
     * 매물의 태그 정보를 변환한다.
     * @param article
     * @private
     */
    private buildArticleTags(article: ArticleEntity) {
        article.tags = this.article.tagList || [];
    }

    /**
     * 숫자 범위로 저장되는 데이터들의 범위를 보정한다.
     * @param naverLandArticle
     * @private
     */
    private correctNumberFieldRange(naverLandArticle: ArticleEntity) {
        const numberRangeOptionMap: {
            [key in 'standard' | 'ratio']: NumberRangeOption;
        } = {
            standard: {
                min: 0,
                max: 99,
                outOfRange: 0,
            },
            ratio: {
                min: 0,
                max: 999,
                outOfRange: 0,
            },
        };

        naverLandArticle.roomCount = numberRange(
            naverLandArticle.roomCount,
            numberRangeOptionMap.standard,
        );
        naverLandArticle.completionYear = numberRange(
            naverLandArticle.completionYear,
            numberRangeOptionMap.standard,
        );
        naverLandArticle.spcRatio = numberRange(
            naverLandArticle.spcRatio,
            numberRangeOptionMap.ratio,
        );
        naverLandArticle.parkingRatio = numberRange(
            naverLandArticle.parkingRatio,
            numberRangeOptionMap.ratio,
        );
    }

    /**
     * 복층 여부를 반환한다.
     * @private
     */
    private extractDuplex() {
        return this.basicInfo?.detailInfo.spaceInfo.duplex ??
            this.article.tagList.includes(DuplexTag.복층)
            ? 'Y'
            : 'N';
    }

    /**
     * 방 개수를 환한다.
     * @private
     */
    private extractRoomCount() {
        if (this.basicInfo?.detailInfo.spaceInfo.roomCount) {
            return this.basicInfo?.detailInfo.spaceInfo.roomCount;
        }

        const roomTags = Object.values(RoomTag);
        const roomIndex = roomTags.indexOf(
            roomTags.find((tag) => this.article.tagList.includes(tag)),
        );

        return roomIndex === -1 ? 1 : roomIndex + 1;
    }

    /**
     * 층 정보를 환한다.
     *
     * @private
     */
    private extractFloor(): {
        floor: Nullable<number>;
        maxFloor: Nullable<number>;
    } {
        if (!this.article.flrInfo) {
            return {
                floor: null,
                maxFloor: null,
            };
        }

        const [floor, maxFloor] = this.article.flrInfo.split('/');

        return {
            floor: isNaN(Number(floor)) ? undefined : Number(floor),
            maxFloor: isNaN(Number(maxFloor)) ? undefined : Number(maxFloor),
        };
    }

    /**
     * 준공년도를 반환한다.
     *
     * @private
     */
    private extractCompletionYear() {
        const completionYear =
            this.complex?.approvalElapsedYear ??
            this.basicInfo?.detailInfo.facilityInfo.approvalElapsedYear;
        if (completionYear) {
            return completionYear;
        }

        const completionYearTags = Object.values(CompletionYearTag);

        const tag = completionYearTags.find((tag) => {
            return this.article.tagList.includes(tag);
        });

        switch (tag) {
            case CompletionYearTag['2년이내']:
                return 2;
            case CompletionYearTag['4년이내']:
                return 4;
            case CompletionYearTag['10년이내']:
                return 10;
            case CompletionYearTag['15년이내']:
                return 15;
            case CompletionYearTag['25년이내']:
                return 25;
            case CompletionYearTag['25년이상']:
                return 26;
            case CompletionYearTag['30년이상']:
                return 30;
        }
    }
}

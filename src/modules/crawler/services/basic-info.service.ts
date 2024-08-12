import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@modules/common/types';
import {
    FrontApiOperationId,
    FrontApiResult,
    RealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';
import { BasicInfoEntity } from '../entities';

@Injectable()
export class BasicInfoService {
    constructor(
        @InjectRepository(BasicInfoEntity)
        private readonly basicInfoRepository: Repository<BasicInfoEntity>,
    ) {}

    /**
     * Basic Info 정보를 생성한다.
     * @param articleId
     * @param realEstateType
     * @param tradeType
     * @param data
     */
    public async create(
        articleId: string,
        realEstateType: RealEstateTypeCode,
        tradeType: TradeType,
        data: FrontApiResult<FrontApiOperationId.ArticleBasicInfo>,
    ) {
        const basicInfo = this.basicInfoRepository.create({
            articleId,
            realEstateType,
            tradeType,
            data,
        });

        return this.basicInfoRepository.save(basicInfo);
    }

    /**
     * Basic Info 정보가 존재하는지 체크한다.
     * @param articleId
     * @param realEstateType
     * @param tradeType
     */
    public async existBy(
        articleId: string,
        realEstateType: RealEstateTypeCode,
        tradeType: TradeType,
    ) {
        return this.basicInfoRepository.existsBy({
            articleId,
            realEstateType,
            tradeType,
        });
    }

    /**
     * Basic Info 정보를 조회한다.
     * @param articleId
     * @param realEstateType
     * @param tradeType
     */
    public async findBy(
        articleId: string,
        realEstateType: RealEstateTypeCode,
        tradeType: TradeType,
    ): Promise<Nullable<BasicInfoEntity>> {
        return this.basicInfoRepository.findOneBy({
            articleId,
            realEstateType,
            tradeType,
        });
    }
}

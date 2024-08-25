import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplexEvStationEntity } from '@modules/crawler';
import {
    FrontApiOperationId,
    FrontApiResult,
} from '@modules/naver-land-client';

@Injectable()
export class ComplexEvStationService {
    constructor(
        @InjectRepository(ComplexEvStationEntity)
        private readonly complexEvStationRepository: Repository<ComplexEvStationEntity>,
    ) {}

    /**
     * 단지 내 전기차 충전 시설 정보를 생성한다.
     * @param complexNumber
     * @param data
     */
    public async create(
        complexNumber: number,
        data: FrontApiResult<FrontApiOperationId.ComplexEvStation>,
    ) {
        const complex = this.complexEvStationRepository.create({
            complexNumber,
            data,
        });

        return this.complexEvStationRepository.save<ComplexEvStationEntity>(
            complex,
        );
    }

    /**
     * 단지 내 전기차 충전 시설 정보가 존재하는지 체크한다.
     * @param complexNumber
     */
    public async existByComplexNumber(complexNumber: number) {
        return this.complexEvStationRepository.existsBy({
            complexNumber,
        });
    }

    /**
     * 단지 내 전기차 충전 시설 정보를 조회한다.
     * @param complexNumber
     */
    public async findByComplexNumber(complexNumber: number) {
        return this.complexEvStationRepository.findOneBy({
            complexNumber,
        });
    }
}

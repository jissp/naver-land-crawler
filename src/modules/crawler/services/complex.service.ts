import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplexEntity } from '../entities';
import {
    FrontApiOperationId,
    FrontApiResult,
} from '@modules/naver-land-client';

@Injectable()
export class ComplexService {
    constructor(
        @InjectRepository(ComplexEntity)
        private readonly complexRepository: Repository<ComplexEntity>,
    ) {}

    /**
     * Complex 정보를 생성한다.
     * @param complexNumber
     * @param data
     */
    public async create(
        complexNumber: number,
        data: FrontApiResult<FrontApiOperationId.Complex>,
    ) {
        const complex = this.complexRepository.create({
            complexNumber,
            data,
        });

        return this.complexRepository.save<ComplexEntity>(complex);
    }

    /**
     * Complex 정보가 존재하는지 체크한다.
     * @param complexNumber
     */
    public async existByComplexNumber(complexNumber: number) {
        return this.complexRepository.existsBy({
            complexNumber,
        });
    }

    /**
     * Complex 정보를 조회한다.
     * @param complexNumber
     */
    public async findByComplexNumber(complexNumber: number) {
        return this.complexRepository.findOneBy({
            complexNumber,
        });
    }
}

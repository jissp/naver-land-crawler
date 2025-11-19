import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RealEstateTypeCode, TradeType } from '@common/naver-land';
import { FrontApiOperationId, FrontApiResult } from '@modules/naver-land-front';

@Entity({
    name: 'basic_infos',
})
export class BasicInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({
        type: 'varchar',
        length: 15,
    })
    articleId: string;

    @Column({
        type: 'enum',
        enum: RealEstateTypeCode,
    })
    realEstateType: RealEstateTypeCode;

    @Column({
        type: 'enum',
        enum: TradeType,
    })
    tradeType: TradeType;

    @Column({
        type: 'json',
    })
    data?: FrontApiResult<FrontApiOperationId.ArticleBasicInfo>;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: null,
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt?: Date;
}

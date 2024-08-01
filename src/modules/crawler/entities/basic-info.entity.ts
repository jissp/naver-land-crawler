import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    FrontApiOperationId,
    FrontApiResult,
    RealEstateTypeCode,
    TradeType,
} from '@modules/naver-land-client';

@Entity({
    name: 'basic_infos',
})
export class BasicInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

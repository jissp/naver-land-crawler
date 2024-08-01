import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RealEstateTypeName, TradeType } from '@modules/naver-land-client';

@Entity({
    name: 'articles',
})
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    articleNo!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    atclNm!: string;

    @Column({
        type: 'enum',
        enum: RealEstateTypeName,
    })
    rletTpNm: RealEstateTypeName;

    @Column({
        type: 'enum',
        enum: TradeType,
    })
    tradTpCd: TradeType;

    @Column({
        type: 'varchar',
        length: 20,
    })
    region1?: string | null;

    @Column({
        type: 'varchar',
        length: 20,
    })
    region2?: string | null;

    @Column({
        type: 'varchar',
        length: 20,
    })
    region3?: string | null;

    @Column({
        type: 'varchar',
        length: 500,
    })
    address?: string | null;

    @Column({
        type: 'integer',
        unsigned: true,
    })
    price!: number;

    @Column({
        type: 'integer',
        unsigned: true,
        nullable: true,
    })
    rentPrice?: number | null;

    @Column({
        type: 'integer',
        unsigned: true,
        nullable: true,
    })
    totalRentPrice?: number | null;

    @Column({
        type: 'decimal',
        precision: 8,
        scale: 2,
    })
    spc1!: number;

    @Column({
        type: 'decimal',
        precision: 8,
        scale: 2,
    })
    spc2!: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    spcRatio: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    spcPrice: number;

    @Column({
        type: 'boolean',
    })
    isDuplex!: 'Y' | 'N';

    @Column({
        type: 'tinyint',
        unsigned: true,
    })
    roomCount!: number;

    @Column({
        type: 'integer',
        unsigned: true,
    })
    parkingCount?: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
    })
    parkingRatio?: number;

    @Column({
        type: 'integer',
        unsigned: true,
    })
    household?: number;

    @Column({
        type: 'tinyint',
        unsigned: true,
    })
    floor?: number | null;

    @Column({
        type: 'tinyint',
        unsigned: true,
    })
    maxFloor?: number | null;

    @Column({
        type: 'varchar',
        length: 15,
    })
    direction: string;

    @Column({
        type: 'tinyint',
        unsigned: true,
    })
    completionYear!: number;

    @Column({
        type: 'decimal',
        unsigned: true,
        scale: 8,
        precision: 2,
    })
    floorAreaRatio!: number;

    @Column({
        type: 'decimal',
        unsigned: true,
        scale: 8,
        precision: 2,
    })
    buildingCoverageRatio!: number;

    @Column({
        type: 'decimal',
        precision: 8,
        scale: 2,
    })
    lat!: number;

    @Column({
        type: 'decimal',
        precision: 8,
        scale: 2,
    })
    lng!: number;

    @Column({
        type: 'json',
    })
    tags?: string[];

    @Column({
        type: 'text',
        nullable: true,
    })
    summary?: string | null;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string | null;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: null,
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt?: Date | null;
}

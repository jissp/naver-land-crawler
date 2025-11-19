import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FrontApiOperationId, FrontApiResult } from '@modules/naver-land-front';

@Entity({
    name: 'complex_ev_stations',
})
export class ComplexEvStationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({
        type: 'bigint',
        unsigned: true,
    })
    complexNumber: number;

    @Column({
        type: 'json',
    })
    data?: FrontApiResult<FrontApiOperationId.ComplexEvStation>;

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

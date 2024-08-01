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
} from '@modules/naver-land-client';

@Entity({
    name: 'complexes',
})
export class ComplexEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'bigint',
        unsigned: true,
    })
    complexNumber: number;

    @Column({
        type: 'json',
    })
    data?: FrontApiResult<FrontApiOperationId.Complex>;

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

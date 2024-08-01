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
    name: 'article_keys',
})
export class ArticleKeyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 15,
    })
    articleId: string;

    @Column({
        type: 'json',
    })
    data?: FrontApiResult<FrontApiOperationId.ArticleKey>;

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

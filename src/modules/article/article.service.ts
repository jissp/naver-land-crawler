import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '@modules/common/types';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleEntity: Repository<ArticleEntity>,
    ) {}

    /**
     * @param articleNo
     */
    public async findByArticleNo(
        articleNo: string,
    ): Promise<Nullable<ArticleEntity>> {
        return this.articleEntity.findOneBy({
            articleNo,
        });
    }

    /**
     * @param article
     */
    public async create(
        article: Omit<ArticleEntity, 'id' | 'createdAt' | 'updatedAt'>,
    ) {
        return this.articleEntity.save<ArticleEntity>(article);
    }

    /**
     * @param article
     */
    public async upsert(
        article: Omit<ArticleEntity, 'id' | 'createdAt' | 'updatedAt'>,
    ) {
        const existingArticle = await this.findByArticleNo(article.articleNo);
        if (!existingArticle) {
            return this.create(article);
        }

        Object.assign(existingArticle, article);

        return this.articleEntity.save<ArticleEntity>(existingArticle);
    }

    /**
     * @param articleNo
     * @param data
     */
    public async updateAddress(
        articleNo: string,
        data: Pick<
            ArticleEntity,
            'address' | 'region1' | 'region2' | 'region3'
        >,
    ) {
        return this.articleEntity.update(
            {
                articleNo,
            },
            data,
        );
    }
}

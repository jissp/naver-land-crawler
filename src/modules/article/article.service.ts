import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '@modules/article/article.entity';
import { Repository } from 'typeorm';

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
    ): Promise<ArticleEntity | null> {
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
        return this.articleEntity.save<ArticleEntity>(article, {
            reload: true,
        });
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

        return this.articleEntity.save<ArticleEntity>(existingArticle, {
            reload: true,
        });
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

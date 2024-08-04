import { Repository } from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    FrontApiOperationId,
    FrontApiResult,
} from '@modules/naver-land-client';
import { ArticleKeyEntity } from '../entities';

@Injectable()
export class ArticleKeyService {
    constructor(
        @InjectRepository(ArticleKeyEntity)
        private readonly articleKeyRepository: Repository<ArticleKeyEntity>,
    ) {}

    /**
     * Article Key 정보를 생성한다.
     * @param articleId
     * @param data
     * @param options
     */
    public async create(
        articleId: string,
        data: FrontApiResult<FrontApiOperationId.ArticleKey>,
        options?: SaveOptions,
    ) {
        const articleKey = this.articleKeyRepository.create({
            articleId,
            data,
        });

        return this.articleKeyRepository.save(articleKey, options);
    }

    /**
     * Article Key 정보가 존재하는지 체크한다.
     * @param articleId
     */
    public async existByArticleId(articleId: string) {
        return this.articleKeyRepository.existsBy({
            articleId,
        });
    }

    /**
     * Article Key 정보를 조회한다.
     * @param articleId
     */
    public async findByArticleId(
        articleId: string,
    ): Promise<ArticleKeyEntity | null> {
        return this.articleKeyRepository.findOneBy({
            articleId,
        });
    }
}

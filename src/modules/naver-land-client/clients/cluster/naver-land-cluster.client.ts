import { Injectable } from '@nestjs/common';
import { ArticleListRequestDto, ArticleListResponseDto } from './dtos';
import { NaverLandClientAbstract } from '../naver-land.client.abstract';

@Injectable()
export class NaverLandClusterClient extends NaverLandClientAbstract {
    constructor() {
        super('https://m.land.naver.com');
    }

    /**
     * 부동산 매물 목록 조회 API
     * @param request
     */
    public async getArticleList(
        request: ArticleListRequestDto,
    ): Promise<ArticleListResponseDto> {
        return this.call<ArticleListResponseDto>({
            method: 'GET',
            path: '/cluster/ajax/articleList',
            queryParams: {
                ...request,
            },
        });
    }
}

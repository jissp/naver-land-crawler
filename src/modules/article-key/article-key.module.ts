import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleKeyEntity, ArticleKeyService } from './index';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleKeyEntity])],
    providers: [ArticleKeyService],
    exports: [ArticleKeyService],
})
export class ArticleKeyModule {}

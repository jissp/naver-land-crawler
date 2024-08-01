import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@modules/article/article.entity';
import { ArticleService } from '@modules/article/article.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity])],
    providers: [ArticleService],
    exports: [ArticleService],
})
export class ArticleModule {}

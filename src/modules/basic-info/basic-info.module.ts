import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BasicInfoEntity, BasicInfoService } from './index';

@Module({
    imports: [TypeOrmModule.forFeature([BasicInfoEntity])],
    providers: [BasicInfoService],
    exports: [BasicInfoService],
})
export class BasicInfoModule {}

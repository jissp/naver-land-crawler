import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComplexEntity, ComplexService } from './index';

@Module({
    imports: [TypeOrmModule.forFeature([ComplexEntity])],
    providers: [ComplexService],
    exports: [ComplexService],
})
export class ComplexModule {}

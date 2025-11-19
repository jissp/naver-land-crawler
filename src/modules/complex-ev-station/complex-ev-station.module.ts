import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComplexEvStationEntity, ComplexEvStationService } from './index';

@Module({
    imports: [TypeOrmModule.forFeature([ComplexEvStationEntity])],
    providers: [ComplexEvStationService],
    exports: [ComplexEvStationService],
})
export class ComplexEvStationModule {}

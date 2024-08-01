import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RedisOptions } from 'ioredis';

interface Configuration {
    database: TypeOrmModuleOptions;
    redis: RedisOptions;
    kakao_rest_api_key: string;
}

export default (): Configuration => ({
    database: {
        type: 'mysql',
        host: process.env['database_host'] ?? 'mysql',
        port: Number(process.env['database_port'] ?? 3306),
        database: process.env['database_collection'] ?? 'localhost',
        username: process.env['database_user'] ?? 'crawler',
        password: process.env['database_password'] ?? '!@#crawler',
        timezone: 'Z',
        synchronize: false,
        autoLoadEntities: true,
        extra: {
            decimalNumbers: true,
        },
        namingStrategy: new SnakeNamingStrategy(),
    },
    redis: {
        host: process.env['redis_host'] ?? 'redis',
        port: Number(process.env['redis_port'] ?? 6379),
    },
    kakao_rest_api_key: process.env['kakao_rest_api_key'],
});

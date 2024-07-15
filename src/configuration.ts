import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RedisOptions } from 'ioredis';

interface Configuration {
    database: TypeOrmModuleOptions;
    redis: RedisOptions;
}

export default (): Configuration => ({
    database: {
        type: 'mysql',
        host: process.env['database_host'],
        port: Number(process.env['database_port']) || 3306,
        database: process.env['database_collection'],
        username: process.env['database_user'],
        password: process.env['database_password'],
        timezone: 'Z',
        synchronize: false,
        autoLoadEntities: true,
        extra: {
            decimalNumbers: true,
        },
        namingStrategy: new SnakeNamingStrategy(),
    },
    redis: {
        host: process.env['redis_host'] || 'localhost',
        port: process.env['redis_port']
            ? Number(process.env['redis_port'])
            : 6379,
    },
});

import { DynamicModule } from '@nestjs/common';
import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class QueueModule {
    public static forRoot(): DynamicModule {
        return {
            module: QueueModule,
            imports: [
                BullModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => {
                        return {
                            redis: configService.get('redis'),
                        } as BullRootModuleOptions;
                    },
                }),
            ],
        };
    }

    public static forFeature(options?: {
        prefix?: string;
        queueTypes: string[];
    }): DynamicModule {
        if (!options?.queueTypes) {
            return {
                module: QueueModule,
                imports: [],
                exports: [],
            };
        }

        const queues = BullModule.registerQueue(
            ...options.queueTypes.map((queueType) => {
                const prefix = options?.prefix || queueType;

                return {
                    name: queueType,
                    prefix: `{${prefix}}`,
                };
            }),
        );

        return {
            module: QueueModule,
            imports: [queues],
            exports: [queues],
        };
    }
}

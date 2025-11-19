import { Queue } from 'bull';
import { DynamicModule, Provider } from '@nestjs/common';
import { BullModule, BullRootModuleOptions, getQueueToken } from '@nestjs/bull';
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

    public static forFeature(
        queueTypes: string[],
        options?: {
            prefix?: string;
        },
    ): DynamicModule {
        if (!queueTypes.length) {
            return {
                module: QueueModule,
                imports: [],
                exports: [],
            };
        }

        const queues = BullModule.registerQueue(
            ...this.createQueueConfigurations(queueTypes, options),
        );

        return {
            module: QueueModule,
            imports: [queues],
            exports: [queues],
        };
    }

    public static getQueueProviders(queueTypes: string[]): Provider[] {
        if (!queueTypes.length) {
            return [];
        }

        return queueTypes.map((queueType) => ({
            provide: queueType,
            inject: [getQueueToken(queueType)],
            useFactory: (queue: Queue) => queue,
        }));
    }

    private static createQueueConfigurations(
        queueTypes: string[],
        options?: { prefix?: string },
    ) {
        return queueTypes.map((queueType) => {
            const prefix = options?.prefix || queueType;
            return {
                name: queueType,
                prefix: `{${prefix}}`,
            };
        });
    }
}

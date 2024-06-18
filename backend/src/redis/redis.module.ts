import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { ModuleRef } from '@nestjs/core';
import { IORedisKey } from './redis.constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IORedisKey,
      useFactory: async (configService: ConfigService) => {
        return new Redis(configService.get('redis'));
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(): Promise<any> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IORedisKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}

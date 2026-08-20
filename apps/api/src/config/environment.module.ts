import { Global, Module } from '@nestjs/common';
import { loadEnvironment } from './environment';

export const API_ENVIRONMENT = Symbol('API_ENVIRONMENT');

@Global()
@Module({
  providers: [
    {
      provide: API_ENVIRONMENT,
      useFactory: loadEnvironment,
    },
  ],
  exports: [API_ENVIRONMENT],
})
export class EnvironmentModule {}

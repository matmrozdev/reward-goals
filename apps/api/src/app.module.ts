import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentModule } from './config/environment.module';
import { GoalsModule } from './goals/goals.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EnvironmentModule, PrismaModule, AuthModule, GoalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

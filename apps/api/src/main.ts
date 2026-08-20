import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApplication } from './app.bootstrap';
import { loadEnvironment } from './config/environment';

async function bootstrap() {
  const environment = loadEnvironment();
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.listen(environment.port, environment.host);
}
void bootstrap();

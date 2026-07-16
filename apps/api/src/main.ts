import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

// Serverless handler for Vercel production
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}

// Local development fallback
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
}
bootstrap();

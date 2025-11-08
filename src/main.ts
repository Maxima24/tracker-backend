import dotenv from "dotenv";

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: "*", // allow everything for now
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

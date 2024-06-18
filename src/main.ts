import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const PORT = process.env.PORT || 9000
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:7000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
      .setTitle("Rubicon API documentation")
      .setDescription("Here you, as will be able all data from backend")
      .setVersion("1.0.0")
      .addTag("Yuriy")
      .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/api/docs", app, document)

  await app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

bootstrap();

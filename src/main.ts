import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {NestExpressApplication} from "@nestjs/platform-express";
import { join } from "path";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    await new Promise(resolve => setTimeout(resolve, 10000));

    const configService = new ConfigService();
    const PORT = configService.get<string>("PORT") || 9000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle("Rubicon API documentation")
        .setDescription("Here you, as will be able all data from backend")
        .setVersion("1.0.0")
        .addTag("Yuriy")
        .build();

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

bootstrap();

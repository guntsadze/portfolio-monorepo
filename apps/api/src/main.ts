import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
const compression = require("compression");
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & Performance
  app.use(helmet());
  app.use(compression());

  // CORS Configuration
  app.enableCors({
    origin: ["http://localhost:3000", "https://your-domain.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API Prefix
  app.setGlobalPrefix("api/v1");

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("arvi API")
    .setDescription("Professional arvi Backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();

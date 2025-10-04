// vercel-adapter.js
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const helmet = require('helmet');
const compression = require('compression');

let cachedApp = null;

async function getApp() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);

    // Security & Performance
    app.use(helmet({
      contentSecurityPolicy: false, // Vercel-ისთვის
    }));
    app.use(compression());

    // CORS Configuration
    app.enableCors({
      origin: [
        "http://localhost:3000",
        "https://arvi-web.vercel.app"  // slash-ის გარეშე!
      ],
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

    // Swagger - მხოლოდ development-ში
    if (process.env.NODE_ENV !== 'production') {
      const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
      const config = new DocumentBuilder()
        .setTitle("arvi API")
        .setDescription("Professional arvi Backend API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
      
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("api/docs", app, document);
    }

    await app.init();
    cachedApp = app;
    
    console.log('✅ NestJS app initialized for Vercel');
  }
  
  return cachedApp;
}

module.exports = async (req, res) => {
  const app = await getApp();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
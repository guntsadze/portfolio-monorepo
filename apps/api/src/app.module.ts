import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { MenuModule } from "./modules/menu/menu.module";

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env", // Path to root .env file
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        connectionFactory: (connection) => {
          console.log("✅ MongoDB Connected Successfully");
          return connection;
        },
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Feature Modules
    AuthModule,
    UsersModule,
    MenuModule,
  ],
})
export class AppModule {}

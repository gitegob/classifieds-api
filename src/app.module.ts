import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma.module";
import { ProductModule } from "./product/product.module";
import { constants } from "./_shared/config/config";

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [constants],
    }),
    AuthModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}

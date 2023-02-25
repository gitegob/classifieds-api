import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma.module";
import { ProductModule } from "./product/product.module";
import { constants } from "./_shared/config/config";
import { CategoryModule } from "./category/category.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [constants],
    }),
    AuthModule,
    ProductModule,
    CategoryModule,
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
export class AppModule {
  constructor(private readonly prismaService: PrismaService) {}
  async onModuleInit() {
    await this.prismaService.seed();
  }
}

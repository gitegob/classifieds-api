import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Product, User } from "@prisma/client";
import { Auth } from "../auth/decorators/auth.decorator";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { ERole } from "../auth/enums/role.enum";
import { IPage } from "../_shared/interfaces/pagination.interface";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@Controller("products")
@Auth()
@ApiTags("Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth(ERole.SELLER)
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.create(createProductDto, user);
  }

  @Get()
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<IPage<Product>> {
    return await this.productService.findAll(page || 0, limit || 10);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: string): Promise<Product> {
    return await this.productService.findOne(+id);
  }

  @Patch(":id")
  @Auth(ERole.SELLER)
  async update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.update(+id, updateProductDto, user);
  }

  @Delete(":id")
  @Auth(ERole.SELLER)
  async remove(
    @Param("id", ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<string> {
    await this.productService.remove(+id, user);
    return `Product ${id} deleted`;
  }
}

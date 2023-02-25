import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Product, User } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { IPage } from "../_shared/interfaces/pagination.interface";
import { paginate } from "../_shared/utils/pagination.util";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto, user: User) {
    const newProduct = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        ownerId: user.id,
      },
    });
    return newProduct;
  }

  async findAll(page: number, limit: number): Promise<IPage<Product>> {
    return await paginate<Product, Prisma.ProductFindManyArgs>(
      this.prismaService.product,
      { orderBy: { name: "asc" } },
      page,
      limit,
    );
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);
    if (product.ownerId !== user.id)
      throw new ForbiddenException("Product not editable by you");
    await this.prismaService.product.update({
      where: { id },
      data: { ...updateProductDto },
    });
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const product = await this.findOne(id);
    if (product.ownerId !== user.id)
      throw new ForbiddenException("You cannot delete this product");
    await this.prismaService.product.delete({ where: { id } });
    return `Product ${id} deleted`;
  }
}

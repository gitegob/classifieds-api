import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Product, User } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { IPage } from "../_shared/interfaces/pagination.interface";
import { paginated } from "../_shared/utils/pagination.util";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const category = await this.prismaService.category.findFirst({
      where: { id: createProductDto.categoryId },
    });
    if (!category) throw new NotFoundException("Category not found");
    delete createProductDto.categoryId;
    const newProduct = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        ownerId: user.id,
        categoryId: category.id,
      },
    });
    return newProduct;
  }

  async findAll(page: number, limit: number): Promise<IPage<Product>> {
    return await paginated<Product, Prisma.ProductFindManyArgs>(
      this.prismaService.product,
      {
        orderBy: { name: "asc" },
        include: {
          category: true,
          owner: { select: { id: true, name: true } },
        },
      },
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prismaService.product.findFirst({
      where: { id },
      include: {
        category: true,
        owner: { select: { id: true, name: true } },
      },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (product.ownerId !== user.id)
      throw new ForbiddenException("Product not editable by you");
    await this.prismaService.product.update({
      where: { id },
      data: { ...updateProductDto },
    });
    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<void> {
    const product = await this.findOne(id);
    if (product.ownerId !== user.id)
      throw new ForbiddenException("You cannot delete this product");
    await this.prismaService.product.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { Category, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { unpaginated } from "../_shared/utils/pagination.util";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
    return newCategory;
  }

  async findAll() {
    const categories = await unpaginated<Category, Prisma.CategoryFindManyArgs>(
      this.prismaService.category,
      { orderBy: { name: "asc" } },
    );
    return categories;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    });
    if (!category) throw new NotFoundException("Category not found");
    await this.prismaService.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });
    return await this.prismaService.category.findFirst({
      where: { id },
    });
  }

  async remove(id: number) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    });
    if (!category) throw new NotFoundException("Category not found");
    await this.prismaService.category.delete({ where: { id } });
  }
}

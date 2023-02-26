import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Category } from "@prisma/client";
import { Auth } from "../auth/decorators/auth.decorator";
import { ERole } from "../auth/enums/role.enum";
import { IPage } from "../_shared/interfaces/pagination.interface";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
@Auth()
@ApiTags("Categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(ERole.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<IPage<Category>> {
    return await this.categoryService.findAll();
  }

  @Patch(":id")
  @Auth(ERole.ADMIN)
  async update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(":id")
  @Auth(ERole.ADMIN)
  async remove(@Param("id", ParseIntPipe) id: string): Promise<string> {
    await this.categoryService.remove(+id);
    return `Category with id ${id} deleted`;
  }
}

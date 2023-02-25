import { IPage } from "../interfaces/pagination.interface";

/**
 * Paginate results from prisma query
 * @param model Prisma model
 * @param args Find args
 * @param page page number
 * @param size number of items per page
 * @returns Promise<IPage<TModel>>
 * @author [Brian Gitego](https://github.com/gitegob)
 */
export async function paginated<TModel, TFindManyArgs>(
  model: any,
  args: Omit<TFindManyArgs, "take" | "skip">,
  page = 0,
  size = 10,
): Promise<IPage<TModel>> {
  const items = (await model.findMany({
    ...args,
    take: size,
    skip: size * page,
  })) as TModel[];
  args["include"] = null;
  const totalItems = await model.count({
    ...args,
  });
  return {
    items,
    totalItems,
    itemCount: items.length,
    itemsPerPage: size,
    totalPages: Math.ceil(totalItems / size),
    currentPage: page,
  };
}

/**
 * Get unpaginated results from prisma query but send them in a paginated format
 * @param model Prisma model
 * @param args Find args
 * @returns Promise<IPage<TModel>>
 * @author [Brian Gitego](https://github.com/gitegob)
 */
export async function unpaginated<TModel, TFindManyArgs>(
  model: any,
  args: Omit<TFindManyArgs, "take" | "skip">,
): Promise<IPage<TModel>> {
  const items = (await model.findMany({
    ...args,
  })) as TModel[];
  args["include"] = null;
  const totalItems = await model.count({
    ...args,
  });
  return {
    items,
    totalItems,
    itemCount: items.length,
    itemsPerPage: totalItems,
    totalPages: 1,
    currentPage: 0,
  };
}

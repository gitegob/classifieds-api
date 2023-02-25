import {
  Global,
  INestApplication,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { IConstants } from "./_shared/config/IConstants";

@Injectable()
@Global()
export class PrismaService extends PrismaClient implements OnModuleInit {
  schoolId: string;
  parentId: string;
  constructor(private readonly configService: ConfigService<IConstants>) {
    super({ datasources: { db: { url: configService.get("databaseUrl") } } });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
  /**
   * Apply middleware to prisma for delete, find,...
   * @param prismaService [PrismaService]
   */
  applyPrismaMiddleware() {
    this.$use(async (params, next) => {
      // SET deletedAt when deleting
      if (params.action == "delete") {
        // Delete queries
        // Change action to an update
        params.action = "update";
        params.args["data"] = { deletedAt: new Date() };
      }
      if (params.action == "deleteMany") {
        // Delete many queries
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = new Date();
        } else {
          params.args["data"] = { deletedAt: new Date() };
        }
      }

      // Ignore records with deletedAt when updating
      if (params.action == "update") {
        // Change to updateMany - you cannot filter
        // by anything except ID / unique with findUnique
        params.action = "updateMany";
        // Add 'deleted' filter
        // ID filter maintained
        params.args.where["deletedAt"] = null;
      }
      if (params.action == "updateMany") {
        if (params.args.where != undefined) {
          params.args.where["deletedAt"] = null;
        } else {
          params.args["where"] = { deletedAt: null };
        }
      }

      // Ignore records with deletedAt when finding
      if (params.action === "findUnique" || params.action === "findFirst") {
        // Change to findFirst - you cannot filter
        // by anything except ID / unique with findUnique
        params.action = "findFirst";
        // Add 'deleted' filter
        // ID filter maintained
        params.args.where["deletedAt"] = null;
      }
      if (params.action === "findMany" || params.action === "count") {
        // Find many queries
        if (params.args.where) {
          if (params.args.where.deletedAt == undefined) {
            // Exclude deleted records if they have not been explicitly requested
            params.args.where["deletedAt"] = null;
          }
        } else {
          params.args["where"] = { deletedAt: null };
        }
      }
      return next(params);
    });
  }
}

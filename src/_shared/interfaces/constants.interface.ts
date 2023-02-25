export interface IConstants {
  port?: number;
  databaseUrl?: string;
  env?: any;
  jwt?: IJwtConfig;
  allowedOrigins?: string[];
  swaggerEnabled?: boolean;
  adminEmail?: string;
  adminPassword?: string;
}

interface IJwtConfig {
  secret: string;
  expiresIn: string | number;
}

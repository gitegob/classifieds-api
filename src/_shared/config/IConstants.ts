export interface IConstants {
  port?: number;
  databaseUrl?: string;
  env?: any;
  jwt?: IJwtConfig;
  allowedOrigins?: string[];
  swaggerEnabled?: boolean;
}

interface IJwtConfig {
  secret: string;
  expiresIn: string | number;
}

import { IsEnum, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export enum ESellerOrCustomer {
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}

export class RegisterDto extends LoginDto {
  @IsString()
  name: string;
  @IsEnum(ESellerOrCustomer)
  role: ESellerOrCustomer;
}

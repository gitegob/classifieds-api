import { IsEnum, IsString } from "class-validator";
import { ERole } from "../enums/ERole";
import { LoginDto } from "./login.dto";

export class RegisterDto extends LoginDto {
  @IsString()
  name: string;
  @IsEnum(ERole)
  role: ERole;
}

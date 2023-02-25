import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  description: string;
  @IsString()
  @IsUrl()
  image: string;
  @IsDateString()
  dateMfg: Date;
}

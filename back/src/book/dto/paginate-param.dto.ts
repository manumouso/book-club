import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PaginateParamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  type: string;
}

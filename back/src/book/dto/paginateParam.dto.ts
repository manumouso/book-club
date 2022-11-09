import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PaginateParam {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  type: string;
}

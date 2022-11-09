import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class Paginate {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(99999)
  @Transform(({ value }) => parseInt(value))
  take: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(99999)
  cursor?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(99999)
  booksLeftToTake?: number;
}

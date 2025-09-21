import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "John" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsString()
  avatar?: string;
}

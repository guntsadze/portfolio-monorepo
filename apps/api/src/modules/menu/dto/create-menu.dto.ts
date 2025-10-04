import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsArray } from "class-validator";
import { Types } from "mongoose";

export class CreateMenuDto {
  @ApiProperty({ example: "Dashboard", description: "Menu title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "/dashboard", description: "Route path" })
  @IsString()
  path: string;

  @ApiProperty({
    example: "dashboard",
    description: "Icon name",
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: null, description: "Parent menu ID", required: false })
  @IsOptional()
  parentId?: Types.ObjectId | null;

  @ApiProperty({
    example: true,
    description: "Is menu active?",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: ["admin", "user"],
    description: "Roles allowed to see menu",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

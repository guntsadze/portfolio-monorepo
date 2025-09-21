import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsArray } from "class-validator";

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

  @ApiProperty({
    example: ["childMenuId1", "childMenuId2"],
    description: "Child menu IDs",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  children?: string[];

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

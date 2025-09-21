import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "John", description: "User first name" })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Password123!",
    description:
      "Password (min 6 chars, must include uppercase, lowercase, number)",
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;
}

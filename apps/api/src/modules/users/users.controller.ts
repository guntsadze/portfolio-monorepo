import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { User, UserRole } from "./schemas/user.schema";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Types } from "mongoose";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Put("profile")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(
    @CurrentUser() user: any, // ან UserDocument
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(
      (user._id as Types.ObjectId).toHexString(), // cast
      updateProfileDto,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users (Admin only)" })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get user by ID (Admin only)" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}

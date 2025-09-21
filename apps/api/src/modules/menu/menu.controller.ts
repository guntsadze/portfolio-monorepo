import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { Menu } from "./schemas/menu.schema";
import { CreateMenuDto } from "./dto/create-menu.dto";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("create")
  async createMenu(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  async getAllMenus(): Promise<Menu[]> {
    return this.menuService.getAllMenus();
  }

  @Get(":id")
  async getMenu(@Param("id") id: string): Promise<Menu> {
    return this.menuService.getMenuById(id);
  }

  @Put(":id")
  async updateMenu(
    @Param("id") id: string,
    @Body() updateDto: Partial<Menu>,
  ): Promise<Menu> {
    return this.menuService.updateMenu(id, updateDto);
  }

  @Delete(":id")
  async deleteMenu(@Param("id") id: string): Promise<void> {
    return this.menuService.deleteMenu(id);
  }
}

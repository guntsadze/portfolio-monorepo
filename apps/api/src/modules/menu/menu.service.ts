// apps/backend/src/menu/menu.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Menu, MenuDocument } from "./schemas/menu.schema";

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  // Create a new menu item
  async createMenu(createMenuDto: Partial<Menu>): Promise<Menu> {
    const createdMenu = new this.menuModel(createMenuDto);
    return createdMenu.save();
  }

  // Get all menus (optionally only active)
  async getAllMenus(onlyActive = true): Promise<Menu[]> {
    const filter = onlyActive ? { isActive: false } : {};
    return this.menuModel.find(filter).exec();
  }

  // Get a menu by ID
  async getMenuById(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) throw new NotFoundException("Menu not found");
    return menu;
  }

  // Update menu by ID
  async updateMenu(id: string, updateDto: Partial<Menu>): Promise<Menu> {
    const updated = await this.menuModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException("Menu not found");
    return updated;
  }

  // Delete menu by ID
  async deleteMenu(id: string): Promise<void> {
    const res = await this.menuModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException("Menu not found");
  }
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Menu, MenuSchema } from "./schemas/menu.schema";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}

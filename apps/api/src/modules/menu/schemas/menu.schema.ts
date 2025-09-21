import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  path: string;

  @Prop()
  icon?: string;

  @Prop({ type: [String] }) // array of child menu IDs
  children?: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  roles?: string[]; // ["user", "admin"]
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

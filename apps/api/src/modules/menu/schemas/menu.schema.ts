import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true })
  title: string; // მენიუს დასახელება

  @Prop({ required: true })
  path?: string;  // მენიუს patch 

  @Prop()
  icon?: string;

  @Prop({ type: Types.ObjectId, ref: 'Menu', default: null })
  parentId: Types.ObjectId | null; // მშობელი მენიუს ID თუ არის Null მაშინ თვითონ მშობელია

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  roles?: string[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string; // აქ ინახება მხოლოდ ჰეში

  @Prop({ default: UserRole.USER, enum: UserRole })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshTokenHash?: string;

  @Prop({ default: () => new Date() })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isActive: true });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isActive: true });
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async deactivateUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isActive: false });
  }
}

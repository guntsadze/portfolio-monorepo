// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model, Types } from "mongoose";
// import * as bcrypt from "bcryptjs";
// import { User, UserDocument, UserRole } from "../users/schemas/user.schema";
// import { RegisterDto } from "./dto/register.dto";
// import { LoginDto } from "./dto/login.dto";

// export interface JwtPayload {
//   sub: string;
//   email: string;
//   role: UserRole;
//   type: "access" | "refresh";
// }

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
//   user: User;
// }

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private jwtService: JwtService,
//   ) {}

//   async register(registerDto: RegisterDto): Promise<AuthTokens> {
//     const { email, password, firstName, lastName } = registerDto;

//     // Check if user already exists
//     const existingUser = await this.userModel.findOne({ email });
//     if (existingUser) {
//       throw new ConflictException("User with this email already exists");
//     }

//     // Create new user
//     const newUser = new this.userModel({
//       email,
//       password: await bcrypt.hash(password, 10),
//       firstName,
//       lastName,
//     });

//     await newUser.save();
//     return this.generateTokens(newUser);
//   }

//   async login(loginDto: LoginDto): Promise<AuthTokens> {
//     const { email, password } = loginDto;

//     // მოიპოვე user, რომელიც არის Mongoose Document
//     const user = await this.userModel
//       .findOne({ email, isActive: true })
//       .select("+password");

//     if (!user) {
//       throw new UnauthorizedException("პაროლი ან იმეილი არასწორია!");
//     }

//     // შედარება პაროლის
//     // const isMatch = await user.comparePassword(password);

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       throw new UnauthorizedException("პაროლი ან იმეილი არასწორია!");
//     }

//     // ბოლო ლოგინი
//     user.lastLogin = new Date();
//     await user.save();

//     return this.generateTokens(user);
//   }

//   async refreshToken(refreshToken: string): Promise<AuthTokens> {
//     try {
//       const payload = this.jwtService.verify(refreshToken, {
//         secret: process.env.JWT_REFRESH_SECRET,
//       });

//       const user = await this.userModel.findById(payload.sub);
//       if (!user || user.refreshToken !== refreshToken) {
//         throw new UnauthorizedException("Invalid refresh token");
//       }

//       return this.generateTokens(user);
//     } catch (error) {
//       throw new UnauthorizedException("Invalid refresh token");
//     }
//   }

//   async logout(userId: string): Promise<void> {
//     await this.userModel.findByIdAndUpdate(userId, {
//       refreshToken: null,
//     });
//   }

//   private async generateTokens(user: UserDocument): Promise<AuthTokens> {
//     const payload: JwtPayload = {
//       sub: (user._id as Types.ObjectId).toHexString(),
//       email: user.email,
//       role: user.role,
//       type: "access",
//     };

//     const refreshPayload: JwtPayload = {
//       ...payload,
//       type: "refresh",
//     };

//     const accessToken = this.jwtService.sign(payload, {
//       secret: process.env.JWT_SECRET,
//       expiresIn: process.env.JWT_EXPIRE_TIME || "1h",
//     });

//     const refreshToken = this.jwtService.sign(refreshPayload, {
//       secret: process.env.JWT_REFRESH_SECRET,
//       expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || "7d",
//     });

//     // Store refresh token in database
//     user.refreshToken = refreshToken;
//     await user.save();

//     return {
//       accessToken,
//       refreshToken,
//       user,
//     };
//   }

//   async validateUser(payload: JwtPayload): Promise<User> {
//     const user = await this.userModel.findById(payload.sub);
//     if (!user || !user.isActive) {
//       throw new UnauthorizedException("User not found or inactive");
//     }
//     return user;
//   }
// }

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as argon2 from "argon2";
import { User, UserDocument, UserRole } from "../users/schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private argonOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  };

  // ---------------- REGISTER ----------------
  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // hash password with argon2
    const passwordHash = await argon2.hash(password, this.argonOptions);

    const newUser = new this.userModel({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    await newUser.save();
    return this.generateTokens(newUser);
  }

  // ---------------- LOGIN ----------------
  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const { email, password } = loginDto;

    const user = await this.userModel
      .findOne({ email, isActive: true })
      .select("+passwordHash");

    if (!user) {
      throw new UnauthorizedException("პაროლი ან იმეილი არასწორია!");
    }

    const isMatch = await argon2.verify(user.passwordHash, password);

    if (!isMatch) {
      throw new UnauthorizedException("პაროლი ან იმეილი არასწორია!");
    }

    // ბოლო ლოგინი
    user.lastLogin = new Date();
    await user.save();

    return this.generateTokens(user);
  }

  // ---------------- JWT TOKENS ----------------
  private async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const payload = {
      sub: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE_TIME || "1h",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || "7d",
    });

    // store hashed refresh token
    user.refreshTokenHash = await argon2.hash(refreshToken, this.argonOptions);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  // ---------------- REFRESH TOKEN ----------------
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload: any = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel
        .findById(payload.sub)
        .select("+refreshTokenHash");
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const match = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (!match) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}

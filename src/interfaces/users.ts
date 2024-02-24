import { Document } from "mongoose";

enum userRole {
  ADMIN = "Admin",
  BUYER = "Buyer",
  SELLER = "Seller",
}
interface IName {
  firstName: string;
  lastName: string;
}

interface IUser extends Document {
  name: IName;
  email: string;
  userName: string;
  password: string;
  isAdmin: boolean;
  role: userRole;
  address: string;
  contact: string;
  refreshToken?: string; // Add this line
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export { IUser, userRole, IName };

import mongoose, { model, Schema } from "mongoose";
import { IUser, userRole } from "../interfaces/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      required: true,
    },
    isAdmin: {
      type: Boolean,
      reaquired: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    refreshToken: { type: String },
  },

  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    next();
  }
});
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    role: this.role,
  };
  const secret = `${process.env.ACCESS_TOKEN_SECRET}`;
  const options = { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}` };

  return jwt.sign(payload, secret, options);
};
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Something went wrong while comparing passwords");
  }
};
userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    role: this.role,
  };
  const secret = `${process.env.ACCESS_TOKEN_SECRET}`;
  const options = { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}` };

  return jwt.sign(payload, secret, options);
};

export const User = model<IUser>("User", userSchema);

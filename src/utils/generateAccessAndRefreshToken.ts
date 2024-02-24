import { User } from "../models/users";
import { ApiError } from "./ApiError";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      // Handle the case when user is null
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // Handle other errors
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export { generateAccessAndRefreshToken };

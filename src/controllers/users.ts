import { Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHanlder";
import { User } from "../models/users";

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "User dosen't exist");
  }
  res.status(200).json(new ApiResponse(200, user, "User Found Successfully"));
});

const getAllUsers = asyncHandler(async (_, res: Response) => {
  const users = await User.find().lean().select("-password -refreshToken");
  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      // User with the given ID not found
      throw new ApiError(404, "User not found");
    }
    // User deleted successfully
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export { getUser, getAllUsers, deleteUser };

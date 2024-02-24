import { Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHanlder";
import { User } from "../models/users";

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

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, userName, password, isAdmin, contact, address } =
    req.body;
  if (
    !(
      name &&
      email &&
      role &&
      userName &&
      password &&
      isAdmin &&
      contact &&
      address
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (
    [email, role, userName, password, contact, address].some(
      (elem) => elem.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required with non-empty values");
  }
  if (
    !name ||
    typeof name !== "object" ||
    !name.firstName ||
    !name.lastName ||
    typeof name.firstName !== "string" ||
    typeof name.lastName !== "string" ||
    name.firstName.trim() === "" ||
    name.lastName.trim() === ""
  ) {
    throw new ApiError(
      400,
      "Name should have both firstName and lastName with non-empty values"
    );
  }

  const existUser = await User.findOne({
    $and: [{ name }, { email }],
  });
  console.log({ existUser });

  if (existUser) {
    throw new ApiError(400, "User already registered");
  }

  const newUser = await User.create({
    name,
    email,
    role,
    userName,
    password,
    isAdmin,
    contact,
    address,
  });
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while creating new user");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createdUser,
        createdUser?.isAdmin
          ? "Admin created successfully"
          : "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password, contact, isAdmin } = req.body;
  if (isAdmin) {
    if ([userName, email, password, contact].some((elem) => elem.trim === "")) {
      throw new ApiError(400, "All fields are required with non-empty value");
    }
    const user = await User.findOne({
      $and: [{ userName }, { email }, { contact }],
    });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    const isPassValid = await user.comparePassword(password);
    if (!isPassValid) {
      throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken },
          "User Login Successfully"
        )
      );
  }

  if ([userName, email, password].some((elem) => elem.trim === "")) {
    throw new ApiError(400, "All fields are required with non-empty value");
  }

  const user = await User.findOne({ $and: [{ userName }, { email }] });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  const isPassValid = await user.comparePassword(password);
  if (!isPassValid) {
    throw new ApiError(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User Login Successfully"
      )
    );
});

export { registerUser, loginUser };
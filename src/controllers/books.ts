import { Request, Response } from "express";
import { Book } from "../models/books";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHanlder";

const registerBooks = asyncHandler(async (req: Request, res: Response) => {
  const { name, rating, publishedBy } = req.body.payload;
  try {
    if (!(name && rating && publishedBy)) {
      throw new ApiError(401, "All fields are required");
    }
    if ([name, rating, publishedBy].some((elem) => elem.trim() === "")) {
      throw new ApiError(401, "All fields are required with non-empty value");
    }
    const existBook = await Book.findOne({
      $and: [{ name }, { author: req.body.user._id }, { publishedBy }],
    });
    if (existBook) {
      throw new ApiError(402, "Book already exist");
    }
    const book = {
      name,
      rating,
      publishedBy,
      author: req.body.user._id,
    };
    console.log({ book });

    const registeredBook = await Book.create(book);
    if (!registeredBook) {
      throw new ApiError(401, "Something went wrong while registering book");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, registeredBook, "Book added successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      // If it's an ApiError, rethrow it
      throw new ApiError(402, "Book already exist");
    } else {
      // If it's another type of error, handle it appropriately
      console.error("Internal Server Error:", error);
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

export { registerBooks };

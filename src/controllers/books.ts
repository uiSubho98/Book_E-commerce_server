import { Request, Response } from "express";
import mongoose from "mongoose";
import { Book } from "../models/books";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHanlder";
import { ObjectId } from "bson";

const registerBooks = asyncHandler(async (req: Request, res: Response) => {
  const { name, rating, publishedBy, price } = req.body.payload;
  try {
    if (!(name && rating && publishedBy && price)) {
      throw new ApiError(401, "All fields are required");
    }
    if ([name, rating, publishedBy, price].some((elem) => elem.trim() === "")) {
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
      price,
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

const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await Book.find().lean();
  res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully"));
});
const getBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "invalid paramete");
  }
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(401, "Invalid Book id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book Found Successfully"));
});

const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publishedBy, name, rating, price } = req.body.payload;
  const authorId: any = new ObjectId(req.body.user._id);
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(401, "Book not found");
  }
  if (!authorId.equals(book.author)) {
    throw new ApiError(401, "Access denied to update the book");
  }
  if (!id) {
    throw new ApiError(401, "Invalid parameter");
  }

  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { publishedBy, name, rating, price },
    { new: true }
  );
  if (!updatedBook) {
    throw new ApiError(401, "Book not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated Successfully"));
});

const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authorId: any = new ObjectId(req.body.user._id);
  if (!id) {
    throw new ApiError(401, "Invalid parameter");
  }
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(401, "Book not found");
  }
  if (!authorId.equals(book.author)) {
    throw new ApiError(401, "Access denied to delete the book");
  }
  await Book.deleteOne({ _id: id });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Book Deleted Successfully"));
});

export { registerBooks, getAllBooks, getBook, updateBook, deleteBook };

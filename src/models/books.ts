import { Schema, model } from "mongoose";
import { IBooks } from "../interfaces/books";
import { User } from "./users";

const bookSchema = new Schema<IBooks>(
  {
    name: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedBy: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Book = model<IBooks>("Book", bookSchema);

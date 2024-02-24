import { Document, Schema } from "mongoose";

interface IBooks extends Document {
  name: string;
  publishedBy: string;
  author: Schema.Types.ObjectId;
  rating: number;
}

export { IBooks };

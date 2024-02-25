import { model, Schema } from "mongoose";
import { IOrders } from "../interfaces/orders";

const ordersSchema = new Schema<IOrders>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    isPurchased: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = model<IOrders>("Order", ordersSchema);

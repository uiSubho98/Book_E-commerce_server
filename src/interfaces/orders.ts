import { Document, Schema } from "mongoose";

interface IOrders extends Document {
  sellerId: Schema.Types.ObjectId;
  buyerId: Schema.Types.ObjectId;
  bookId: Schema.Types.ObjectId;
  amount: number;
  quantity: number;
  paymentId: string;
  isPurchased: boolean;
}

export { IOrders };

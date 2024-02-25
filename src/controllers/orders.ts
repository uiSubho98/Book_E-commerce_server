import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHanlder";
import { Order } from "../models/orders";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { generatePaymentId } from "../utils/generatePaymentId";

const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const { sellerId, buyerId, bookId, amount, quantity } = req.body.payload;

  const paymentId = await generatePaymentId();

  console.log({ sellerId, buyerId, bookId, amount, quantity });
  console.log({ paymentId });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newOrder = new Order({
      sellerId,
      buyerId,
      bookId,
      amount,
      quantity,
      paymentId,
      isPurchased: false,
    });

    // Use the session to pass the transaction context
    const savedOrder = await newOrder.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Update isPurchased to true after committing the transaction
    const updatedOrder = await Order.findByIdAndUpdate(
      savedOrder._id,
      {
        $set: { isPurchased: true },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order placed Successfully"));
  } catch (error) {
    // If an error occurs, abort the transaction
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Internal Server Error");
  }
});

export { placeOrder };

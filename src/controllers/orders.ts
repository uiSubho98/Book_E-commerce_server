import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHanlder";
import { Order } from "../models/orders";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { generatePaymentId } from "../utils/generatePaymentId";
import { ObjectId } from "bson";

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

const getSingleOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || id.trim() === "") {
    throw new ApiError(401, "Invalid id");
  }
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(401, "Order not found");
  }
  const buyerId: any = new ObjectId(req.body.user._id);
  if (!buyerId.equals(order.buyerId)) {
    throw new ApiError(401, "Unauthorized Acess");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.user.role === "Buyer") {
    const buyerId: any = new ObjectId(req.body.user._id);
    const orders = await Order.find({ buyerId }).lean();
    console.log({ orders });
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Order fetched sucessfully"));
  } else if (req.body.user.role === "Admin") {
    const orders = await Order.find().lean();
    console.log({ orders });
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Order fetched sucessfully"));
  }
});
export { placeOrder, getSingleOrder, getAllOrders };

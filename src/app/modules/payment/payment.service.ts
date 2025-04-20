import { IPayment, IPaymentFilters } from "./payment.interface";
import { Payment } from "./payment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { Order } from "../order/order.model";
import { User } from "../users/user.model";
import { paymentSearchableFields } from "./payment.constants";
import { paymentGateway } from "../../../config/payment.config";
import axios from "axios";
import Stripe from "stripe";

const createPayment = async (payload: IPayment): Promise<IPayment> => {
  // Validate order exists
  const order = await Order.findById(payload.order);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Validate user exists
  const user = await User.findById(payload.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate payment method
  if (!["paypal", "stripe"].includes(payload.paymentMethod)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payment method");
  }

  // Create payment record with pending status
  const payment = await Payment.create({
    ...payload,
    status: "pending",
  });

  try {
    if (payload.paymentMethod === "stripe") {
      return await processStripePayment(
        {
          ...payment.toObject(),
          _id: String(payment._id),
        } as unknown as IPayment & { _id: string },
        order
      );
    } else {
      return await processPaypalPayment(
        {
          ...payment.toObject(),
          _id: String(payment._id),
        } as unknown as IPayment & { _id: string },
        order
      );
    }
  } catch (error) {
    // Update payment status if error occurs
    await Payment.findByIdAndUpdate(payment._id, {
      status: "failed",
      paymentDetails:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
    throw error;
  }
};

const getAllPayments = async (
  filters: IPaymentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPayment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: paymentSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (field === "minAmount") {
          return { amount: { $gte: value } };
        } else if (field === "maxAmount") {
          return { amount: { $lte: value } };
        } else {
          return { [field]: value };
        }
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Payment.find(whereConditions)
    .populate("order")
    .populate("user")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPaymentById = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findById(id).populate("order").populate("user");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

const updatePayment = async (
  id: string,
  payload: Partial<IPayment>
): Promise<IPayment | null> => {
  const existingPayment = await Payment.findById(id);
  if (!existingPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  // If updating status to success, update order status
  if (payload.status === "success") {
    await Order.findByIdAndUpdate(existingPayment.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });
  }

  const result = await Payment.findByIdAndUpdate(id, payload, { new: true })
    .populate("order")
    .populate("user");

  return result;
};

const deletePayment = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

const getUserPayments = async (
  userId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPayment[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Payment.find({ user: userId })
    .populate("order")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments({ user: userId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const processStripePayment = async (
  payment: IPayment & { _id: string },
  order: any
) => {
  try {
    // Create Stripe Checkout Session
    const session = await paymentGateway.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order._id}`,
              description: `Payment for ${order.package.name}`,
            },
            unit_amount: Math.round(order.totalAmount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?paymentId=${payment._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel?paymentId=${payment._id}`,
      metadata: {
        paymentId: payment._id.toString(),
        orderId: order._id.toString(),
      },
    });

    // Update payment with Stripe session ID
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        transactionId: session.id,
        paymentDetails: session,
      },
      { new: true }
    )
      .populate("order")
      .populate("user");

    return updatedPayment!;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new ApiError(httpStatus.BAD_REQUEST, `Stripe error: ${errorMessage}`);
  }
};

const processPaypalPayment = async (
  payment: IPayment & { _id: string },
  order: any
) => {
  try {
    // Get PayPal access token
    const auth = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID!,
          password: process.env.PAYPAL_SECRET!,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = auth.data.access_token;

    // Create PayPal order
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order.totalAmount.toString(),
            },
            description: `Payment for Order #${order._id}`,
          },
        ],
        application_context: {
          brand_name: "Your Company Name",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.CLIENT_URL}/payment/success?paymentId=${payment._id}`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel?paymentId=${payment._id}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const paypalOrder = response.data;

    // Update payment with PayPal order ID
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        transactionId: paypalOrder.id,
        paymentDetails: paypalOrder,
      },
      { new: true }
    )
      .populate("order")
      .populate("user");

    return updatedPayment!;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new ApiError(httpStatus.BAD_REQUEST, `PayPal error: ${errorMessage}`);
  }
};

const verifyPayment = async (paymentId: string): Promise<IPayment> => {
  const payment = await Payment.findById(paymentId)
    .populate("order")
    .populate("user");
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "success") {
    return payment;
  }

  try {
    if (payment.paymentMethod === "stripe") {
      return await verifyStripePayment(payment);
    } else {
      return await verifyPaypalPayment(payment);
    }
  } catch (error) {
    await Payment.findByIdAndUpdate(paymentId, {
      status: "failed",
      paymentDetails:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
    throw error;
  }
};

const verifyStripePayment = async (payment: IPayment) => {
  const session = await paymentGateway.stripe.checkout.sessions.retrieve(
    payment.transactionId!
  );

  if (session.payment_status === "paid") {
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        status: "success",
        paymentDetails: session,
      },
      { new: true }
    )
      .populate("order")
      .populate("user");

    // Update order status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });

    return updatedPayment!;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Payment not completed");
};

const verifyPaypalPayment = async (payment: IPayment) => {
  // Get PayPal access token
  const auth = await axios.post(
    `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID!,
        password: process.env.PAYPAL_SECRET!,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = auth.data.access_token;

  // Get PayPal order details
  const response = await axios.get(
    `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${payment.transactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const paypalOrder = response.data;

  if (paypalOrder.status === "COMPLETED") {
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        status: "success",
        paymentDetails: paypalOrder,
      },
      { new: true }
    )
      .populate("order")
      .populate("user");

    // Update order status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });

    return updatedPayment!;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Payment not completed");
};

const handleStripeWebhook = async (payload: Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    event = paymentGateway.stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Proper type checking for the error
    const errorMessage =
      err instanceof Error ? err.message : "Unknown webhook error";
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Webhook Error: ${errorMessage}`
    );
  }

  // Handle specific event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Safely access metadata with type guards
    if (session.metadata && "paymentId" in session.metadata) {
      const paymentId = session.metadata.paymentId;

      if (paymentId) {
        await verifyPayment(paymentId);
      }
    }
  }

  return { received: true };
};

export const PaymentService = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getUserPayments,
  verifyPayment,
  handleStripeWebhook,
};

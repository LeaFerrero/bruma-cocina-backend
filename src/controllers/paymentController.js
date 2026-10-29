import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";

const createPayment = async (req, res, next) => {
  try {
    const { order, paymentMethod, paidAt } = req.body;

    const orderExists = await Order.findById(order);
    if (!orderExists) {
      throw new AppError(
        "La orden especificada no existe",
        404,
        null,
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (orderExists.orderStatus === ORDER_STATUS.CANCELADO) {
      throw new AppError(
        "No se puede cobrar un pedido cancelado",
        409,
        null,
        "CONFLICT",
      );
    }

    if (orderExists.paymentStatus === PAYMENT_STATUS.PAGADO) {
      throw new AppError("El pedido ya fue pagado", 409, null, "CONFLICT");
    }

    const paymentStatus = PAYMENT_STATUS.PAGADO;

    const newPayment = new Payment({
      order,
      totalAmount: orderExists.total,
      paymentMethod,
      paymentStatus,
      paidAt,
    });

    const savedPayment = await newPayment.save();

    orderExists.paymentStatus = paymentStatus;
    await orderExists.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("order-updated", orderExists);
    }

    return sendSuccess(res, 200, "Pago registrado correctamente", {
      payment: savedPayment,
    });
  } catch (error) {
    next(error);
  }
};

export { createPayment };

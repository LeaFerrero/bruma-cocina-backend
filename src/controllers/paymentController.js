import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { sendSuccess } from "../utils/responses.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";

const createPayment = async (req, res, next) => {
  try {
    const { order, totalAmount, paymentMethod, paidAt } = req.body;

    const orderExists = await Order.findById(order);
    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "La orden especificada no existe",
      });
    }

    const paymentStatus = PAYMENT_STATUS.PAGADO;

    const newPayment = new Payment({
      order,
      totalAmount,
      paymentMethod,
      paymentStatus,
      paidAt,
    });

    const savedPayment = await newPayment.save();

    orderExists.paymentStatus = paymentStatus;
    await orderExists.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("order-updated", order);
    }

    return sendSuccess(res, 200, "Pago registrado correctamente", savedPayment);
  } catch (error) {
    next(error);
  }
};

export { createPayment };

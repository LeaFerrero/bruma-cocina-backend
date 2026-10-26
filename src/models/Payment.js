import mongoose from "mongoose";
import { parseDecimal } from "../utils/parsers.js";
import { VALID_PAYMENT_STATUS } from "../constants/paymentStatus.js";
import { VALID_PAYMENT_METHODS } from "../constants/paymentMethods.js";

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "La orden es obligatoria"],
    index: true,
  },

  totalAmount: {
    type: Number,
    required: [true, "El precio es obligatorio."],
    min: [0.01, "El precio tiene que ser mayor a 0"],
    set: (value) => parseDecimal(value, 2),
  },

  paymentMethod: {
    type: String,
    required: [true, "El método de pago es obligatorio"],
    enum: {
      values: VALID_PAYMENT_METHODS,
      message: "{VALUE} no es un método de pago válido en el sistema",
    },
    trim: true,
  },

  paymentStatus: {
    type: String,
    required: [true, "El estado del pago es obligatorio"],
    enum: {
      values: VALID_PAYMENT_STATUS,
      message: "{VALUE} no es un estado de pago válido en el sistema",
    },
    trim: true,
  },

  paidAt: {
    type: String,
    required: [true, "La fecha del pago es obligatoria"],
    index: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

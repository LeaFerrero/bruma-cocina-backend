import mongoose from "mongoose";
import { parseDecimal } from "../utils/parsers.js";
import { ORDER_STATUS, VALID_ORDER_STATUS } from "../constants/orderStatus.js";
import {
  PAYMENT_STATUS,
  VALID_PAYMENT_STATUS,
} from "../constants/paymentStatus.js";

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },

    meals: {
      type: [
        {
          meal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meal",
            required: [true, "La vianda es obligatoria"],
          },

          mealName: {
            type: String,
            required: [true, "El nombre de la vianda es obligatorio"],
          },

          price: {
            type: Number,
            required: [true, "El precio histórico es obligatorio"],
            min: [0, "El precio no puede ser negativo"],
            set: (value) => parseDecimal(value, 2),
          },

          quantity: {
            type: Number,
            required: [true, "La cantidad es obligatoria"],
            min: [1, "La cantidad tiene que ser mayor a 0"],
          },
        },
      ],

      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Debe agregar al menos una vianda al pedido",
      },
    },

    total: {
      type: Number,
      required: [true, "El total del pedido es obligatorio"],
      min: [0, "El total no puede ser negativo"],
      set: (value) => parseDecimal(value, 2),
    },

    orderStatus: {
      type: String,
      enum: {
        values: VALID_ORDER_STATUS,
        message: "{VALUE} no es un estado de orden válido para el sistema",
      },
      default: ORDER_STATUS.PENDIENTE,
    },

    paymentStatus: {
      type: String,
      enum: {
        values: VALID_PAYMENT_STATUS,
        message: "{VALUE} no es un estado de pago válido para el sistema",
      },
      default: PAYMENT_STATUS.PENDIENTE,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

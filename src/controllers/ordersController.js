import Order from "../models/Order.js";
import Meal from "../models/Meal.js";
import AppError from "../utils/AppError.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { sendSuccess } from "../utils/responses.js";
import { generateOrderCode } from "../utils/generateOrderCode.js";
import { getBusinessDate } from "../utils/dates.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getOrders = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, date } = req.query;

    const filter = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (date) {
      filter.dateOnly = date;
    }

    const orders = await Order.find(filter).sort({ createdAt: 1 }).lean();

    return sendSuccess(res, 200, "Comandas listadas con éxito", orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      throw new AppError(
        "Comanda no encontrada",
        404,
        null,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const orderResponse = {
      ...order,
      items: order.meals.map((item) => ({
        _id: item.meal,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    return sendSuccess(res, 200, "Comanda encontrada", {
      order: orderResponse,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { name, lastName, phone, address, notes, meals } = req.body;

    if (!meals || meals.length === 0) {
      throw new AppError(
        "El pedido debe tener al menos una vianda",
        400,
        null,
        ERROR_CODES.BAD_REQUEST,
      );
    }

    let calculatedTotal = 0;
    const validatedMeals = [];
    const stockErrors = [];

    for (const item of meals) {
      const mealDB = await Meal.findById(item._id);

      if (!mealDB) {
        throw new AppError(
          `La vianda solicitada no existe`,
          404,
          null,
          ERROR_CODES.NOT_FOUND,
        );
      }

      if (mealDB.currentStock < item.quantity) {
        stockErrors.push(
          `${mealDB.name}: solo quedan ${mealDB.currentStock} unidades.`,
        );
        continue;
      }

      calculatedTotal += mealDB.price * item.quantity;

      validatedMeals.push({
        meal: mealDB._id,
        name: mealDB.name,
        price: mealDB.price,
        quantity: item.quantity,
      });
    }

    if (stockErrors.length > 0) {
      throw new AppError(
        "Stock insuficiente en algunos productos.",
        409,
        stockErrors,
        ERROR_CODES.INSUFFICIENT_STOCK,
      );
    }

    for (const item of validatedMeals) {
      await Meal.findByIdAndUpdate(item.meal, {
        $inc: { currentStock: -item.quantity },
      });
    }

    const orderCode = await generateOrderCode();

    const newOrder = await Order.create({
      orderCode,
      name,
      lastName,
      phone,
      address,
      notes,
      meals: validatedMeals,
      total: calculatedTotal,
      dateOnly: getBusinessDate(),
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("order-created");
    }

    return sendSuccess(res, 201, "Pedido registrado con éxito", newOrder);
  } catch (error) {
    next(error);
  }
};

const dispatchOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      throw new AppError(
        "Pedido no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (order.orderStatus !== ORDER_STATUS.PENDIENTE) {
      throw new AppError(
        "El pedido ya no está pendiente",
        409,
        null,
        ERROR_CODES.CONFLICT,
      );
    }

    order.orderStatus = ORDER_STATUS.DESPACHADO;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("order-updated", order);
    }

    return sendSuccess(res, 200, "El pedido ha sido despachado", {
      order: order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      throw new AppError(
        "Pedido no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (order.orderStatus !== ORDER_STATUS.PENDIENTE) {
      throw new AppError(
        "El pedido ya no está pendiente",
        409,
        null,
        ERROR_CODES.CONFLICT,
      );
    }

    for (const item of order.meals) {
      await Meal.findByIdAndUpdate(item.meal, {
        $inc: { currentStock: item.quantity },
      });
    }

    order.orderStatus = ORDER_STATUS.CANCELADO;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("order-updated", order);
    }

    return sendSuccess(res, 200, "El pedido ha sido cancelado", {
      order: order,
    });
  } catch (error) {
    next(error);
  }
};

export { getOrders, getOrderById, createOrder, dispatchOrder, cancelOrder };

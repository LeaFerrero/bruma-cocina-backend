import Order from "../models/Order.js";

export const generateOrderCode = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const lastOrder = await Order.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ createdAt: -1 });

  let dailyNumber = 1;
  if (lastOrder && lastOrder.orderCode) {
    const lastNumber = parseInt(lastOrder.orderCode.split("-")[1], 10);
    dailyNumber = lastNumber + 1;
  }

  const day = String(startOfDay.getDate()).padStart(2, "0");
  const month = String(startOfDay.getMonth() + 1).padStart(2, "0");
  const year = String(startOfDay.getFullYear()).slice(-2);

  const formattedNumber = String(dailyNumber).padStart(3, "0");

  return `${day}${month}${year}-${formattedNumber}`;
};

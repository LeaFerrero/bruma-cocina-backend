import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/bruma_cocina_test_stock";
process.env.JWT_SECRET = process.env.JWT_SECRET || "clave_solo_para_pruebas";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const { default: mongoose } = await import("mongoose");
const { default: app } = await import("../../src/app.js");
const { connectDB } = await import("../../src/config/db.js");
const { default: User } = await import("../../src/models/User.js");
const { default: Supply } = await import("../../src/models/Supply.js");
const { default: Meal } = await import("../../src/models/Meal.js");
const { default: Order } = await import("../../src/models/Order.js");
const { ROLES } = await import("../../src/constants/roles.js");

let server;
let baseUrl;
let cookie;
let supply;
let meal;
let orderId;

const api = (path, { method = "GET", body, auth = true } = {}) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

const stockOfSupply = async () =>
  (await Supply.findById(supply._id)).currentStock;
const stockOfMeal = async () => (await Meal.findById(meal._id)).currentStock;

const customer = {
  name: "Ana",
  lastName: "Paz",
  phone: "1122334455",
  address: "Calle Falsa 123",
  notes: "",
};

describe("Flujo de stock: producción, pedidos y cobro (integración)", () => {
  before(async () => {
    await connectDB();

    if (!mongoose.connection.name.includes("test")) {
      throw new Error(
        "Las pruebas solo corren sobre una base cuyo nombre incluya 'test'.",
      );
    }
    await mongoose.connection.dropDatabase();

    const password = "Admin1234";
    const { salt, passwordHash } = User.generateSafePassword(password);
    const userName = await User.generateUniqueUserName("admin", "stock");
    await User.create({
      userName,
      name: "admin",
      lastName: "stock",
      role: ROLES.ADMIN,
      salt,
      passwordHash,
    });

    supply = await Supply.create({
      name: "Pollo de prueba",
      unit: "kg",
      price: 5000,
      currentStock: 10,
      minStock: 2,
    });

    meal = await Meal.create({
      name: "Pollo con arroz de prueba",
      price: 6500,
      minStock: 2,
      category: ["Principal"],
      description: "Vianda de prueba para las pruebas de integración.",
      ingredients: [{ supply: supply._id, quantity: 0.5 }],
    });

    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;

    const loginRes = await api("/api/login", {
      method: "POST",
      body: { userName, password },
      auth: false,
    });
    const tokenCookie = loginRes.headers
      .getSetCookie()
      .find((item) => item.startsWith("token="));
    cookie = tokenCookie.split(";")[0];
  });

  after(async () => {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("registrar producción descuenta los insumos y suma stock de viandas", async () => {
    const res = await api("/api/production", {
      method: "POST",
      body: { meals: [{ _id: String(meal._id), quantity: 4 }] },
    });

    assert.equal(res.status, 201);
    assert.equal(await stockOfSupply(), 8); // 10 - (0,5 x 4)
    assert.equal(await stockOfMeal(), 4);
  });

  it("rechaza una producción cuando no alcanzan los insumos y no modifica nada", async () => {
    const res = await api("/api/production", {
      method: "POST",
      body: { meals: [{ _id: String(meal._id), quantity: 100 }] },
    });
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.match(body.message, /Stock insuficiente/);
    assert.equal(await stockOfSupply(), 8);
    assert.equal(await stockOfMeal(), 4);
  });

  it("un pedido descuenta el stock de viandas y calcula el total en el servidor", async () => {
    const res = await api("/api/orders", {
      method: "POST",
      auth: false,
      body: { ...customer, meals: [{ _id: String(meal._id), quantity: 3 }] },
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.equal(body.data.total, 19500); // 6500 x 3
    assert.equal(await stockOfMeal(), 1);

    orderId = body.data._id;
  });

  it("rechaza un pedido que supera el stock disponible", async () => {
    const res = await api("/api/orders", {
      method: "POST",
      auth: false,
      body: { ...customer, meals: [{ _id: String(meal._id), quantity: 5 }] },
    });

    assert.equal(res.status, 409);
    assert.equal(await stockOfMeal(), 1);
    assert.equal(await Order.countDocuments(), 1);
  });

  it("cancelar el pedido devuelve el stock de viandas", async () => {
    const res = await api(`/api/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.data.order.orderStatus, "cancelado");
    assert.equal(await stockOfMeal(), 4);
  });

  it("no permite despachar un pedido cancelado", async () => {
    const res = await api(`/api/orders/${orderId}/dispatch`, {
      method: "PATCH",
    });

    assert.equal(res.status, 409);
    const order = await Order.findById(orderId);
    assert.equal(order.orderStatus, "cancelado");
  });

  it("no permite cobrar un pedido cancelado", async () => {
    const res = await api("/api/payments", {
      method: "POST",
      body: {
        order: orderId,
        totalAmount: 19500,
        paymentMethod: "efectivo",
        paidAt: "2026-10-30",
      },
    });

    assert.equal(res.status, 409);
    const order = await Order.findById(orderId);
    assert.notEqual(order.paymentStatus, "pagado");
  });
});

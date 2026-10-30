import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.MONGO_URI =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/bruma_cocina_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "clave_solo_para_pruebas";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const { default: mongoose } = await import("mongoose");
const { default: app } = await import("../../src/app.js");
const { connectDB } = await import("../../src/config/db.js");
const { default: User } = await import("../../src/models/User.js");
const { default: Supply } = await import("../../src/models/Supply.js");
const { ROLES } = await import("../../src/constants/roles.js");

const supplyData = {
  name: "Harina de prueba",
  unit: "kg",
  price: "1500,50",
  currentStock: "10",
  minStock: "2",
};

let server;
let baseUrl;
let cookie;
let createdId;
let adminCredentials;

const api = (path, { method = "GET", body, auth = true } = {}) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("API de insumos (integración)", () => {
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
    const userName = await User.generateUniqueUserName("admin", "pruebas");
    await User.create({
      userName,
      name: "admin",
      lastName: "pruebas",
      role: ROLES.ADMIN,
      salt,
      passwordHash,
    });
    adminCredentials = { userName, password };

    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("rechaza el acceso a la lista sin iniciar sesión", async () => {
    const res = await api("/api/supplies", { auth: false });
    assert.ok([401, 403].includes(res.status));
  });

  it("inicia sesión con el administrador y recibe la cookie del token", async () => {
    const res = await api("/api/login", {
      method: "POST",
      body: adminCredentials,
      auth: false,
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.data.user.role, ROLES.ADMIN);

    const tokenCookie = res.headers
      .getSetCookie()
      .find((item) => item.startsWith("token="));
    assert.ok(tokenCookie, "La respuesta debe incluir la cookie token");
    cookie = tokenCookie.split(";")[0];
  });

  it("crea un insumo y queda guardado en la base (Create)", async () => {
    const res = await api("/api/supplies", {
      method: "POST",
      body: supplyData,
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.equal(body.data.supply.name, supplyData.name);
    assert.equal(body.data.supply.price, 1500.5);

    createdId = body.data.supply._id;
    const inDb = await Supply.findById(createdId);
    assert.ok(inDb, "El insumo debe existir en la base de datos");
    assert.equal(inDb.currentStock, 10);
  });

  it("recupera el insumo por la lista y por id (Read)", async () => {
    const listRes = await api("/api/supplies");
    const listBody = await listRes.json();

    assert.equal(listRes.status, 200);
    assert.ok(listBody.data.some((supply) => supply._id === createdId));

    const oneRes = await api(`/api/supplies/${createdId}`);
    const oneBody = await oneRes.json();

    assert.equal(oneRes.status, 200);
    assert.equal(oneBody.data.supply.name, supplyData.name);
  });

  it("rechaza un insumo con el mismo nombre", async () => {
    const res = await api("/api/supplies", {
      method: "POST",
      body: supplyData,
    });

    assert.ok(
      [400, 409].includes(res.status),
      `Se esperaba 400 o 409 ante un nombre duplicado y se obtuvo ${res.status}`,
    );
    assert.equal(await Supply.countDocuments({ name: supplyData.name }), 1);
  });

  it("rechaza un insumo con el stock actual vacío", async () => {
    const res = await api("/api/supplies", {
      method: "POST",
      body: { ...supplyData, name: "Sin stock cargado", currentStock: "" },
    });

    assert.equal(res.status, 400);
    assert.equal(await Supply.countDocuments({ name: "Sin stock cargado" }), 0);
  });

  it("edita el precio del insumo (Update)", async () => {
    const res = await api(`/api/supplies/${createdId}`, {
      method: "PATCH",
      body: { ...supplyData, price: "2000" },
    });

    assert.equal(res.status, 200);
    const inDb = await Supply.findById(createdId);
    assert.equal(inDb.price, 2000);
  });

  it("elimina el insumo con baja lógica (Delete)", async () => {
    const res = await api(`/api/supplies/${createdId}`, { method: "DELETE" });
    assert.equal(res.status, 200);

    const inDb = await Supply.findById(createdId);
    assert.equal(inDb.status, "eliminado");

    const listRes = await api("/api/supplies");
    const listBody = await listRes.json();
    assert.ok(!listBody.data.some((supply) => supply._id === createdId));
  });
});

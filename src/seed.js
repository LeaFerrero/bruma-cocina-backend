import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Supply from "./models/Supply.js";
import Meal from "./models/Meal.js";
import { ROLES } from "./constants/roles.js";
import { UNITS } from "./constants/units.js";

const ADMIN = {
  name: "admin",
  lastName: "admin",
  password: process.env.SEED_ADMIN_PASSWORD || "Admin1234",
};

const SUPPLIES = [
  { name: "Arroz", unit: UNITS.KG, price: 1800, currentStock: 20, minStock: 5 },
  { name: "Pollo", unit: UNITS.KG, price: 5200, currentStock: 15, minStock: 4 },
  {
    name: "Tomate",
    unit: UNITS.KG,
    price: 2400,
    currentStock: 10,
    minStock: 3,
  },
  {
    name: "Aceite de oliva",
    unit: UNITS.L,
    price: 9800,
    currentStock: 6,
    minStock: 2,
  },
];

// Las imágenes son archivos que ya existen en la carpeta uploads/.
// Ajustá cada nombre de archivo para que coincida con la foto de la vianda.
const MEALS = [
  {
    name: "Pollo con arroz",
    price: 6500,
    minStock: 5,
    category: ["Principal"],
    description: "Pechuga de pollo al horno con arroz y verduras.",
    image: "1793073953976-750247002.jpg",
    ingredients: [
      { supply: "Pollo", quantity: 0.25 },
      { supply: "Arroz", quantity: 0.15 },
    ],
  },
  {
    name: "Arroz con tomate",
    price: 5200,
    minStock: 3,
    category: ["Vegetariano"],
    description: "Arroz salteado con salsa de tomate casera.",
    image: "1793074335841-645078659.jpg",
    ingredients: [
      { supply: "Arroz", quantity: 0.2 },
      { supply: "Tomate", quantity: 0.2 },
      { supply: "Aceite de oliva", quantity: 0.02 },
    ],
  },
];

async function seedAdmin() {
  const existing = await User.findOne({ role: ROLES.ADMIN, status: "activo" });
  if (existing) {
    console.log(`Admin ya existente: ${existing.userName} (se omite)`);
    return;
  }

  const userName = await User.generateUniqueUserName(
    ADMIN.name,
    ADMIN.lastName,
  );
  const { salt, passwordHash } = User.generateSafePassword(ADMIN.password);

  await User.create({
    userName,
    name: ADMIN.name,
    lastName: ADMIN.lastName,
    role: ROLES.ADMIN,
    salt,
    passwordHash,
  });

  console.log(
    `Admin creado -> usuario: ${userName} | contraseña: ${ADMIN.password}`,
  );
}

async function seedSupplies() {
  const byName = {};
  for (const data of SUPPLIES) {
    let supply = await Supply.findOne({ name: data.name });
    if (!supply) {
      supply = await Supply.create(data);
      console.log(`Insumo creado: ${data.name}`);
    }
    byName[data.name] = supply;
  }
  return byName;
}

async function seedMeals(suppliesByName) {
  for (const data of MEALS) {
    const existing = await Meal.findOne({ name: data.name });
    if (existing) continue;

    await Meal.create({
      ...data,
      ingredients: data.ingredients.map((item) => ({
        supply: suppliesByName[item.supply]._id,
        quantity: item.quantity,
      })),
    });
    console.log(`Vianda creada: ${data.name}`);
  }
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado a MongoDB");

  await seedAdmin();
  const suppliesByName = await seedSupplies();
  await seedMeals(suppliesByName);

  console.log("Carga inicial finalizada");
}

run()
  .catch((error) => {
    console.error("Error en la carga inicial:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

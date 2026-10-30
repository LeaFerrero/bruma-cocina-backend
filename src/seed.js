import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Supply from "./models/Supply.js";
import Meal from "./models/Meal.js";
import { ROLES } from "./constants/roles.js";
import { UNITS } from "./constants/units.js";

const USERS = [
  {
    name: "admin",
    lastName: "admin",
    role: ROLES.ADMIN,
    password: "Admin1234",
  },
  {
    name: "cocina",
    lastName: "cocina",
    role: ROLES.COCINA,
    password: "Cocina1234",
  },
  {
    name: "caja",
    lastName: "caja",
    role: ROLES.CAJA,
    password: "Caja1234",
  },

  {
    name: "stock",
    lastName: "stok",
    role: ROLES.CAJA,
    password: "Sock1234",
  },
];

const SUPPLIES = [
  {
    name: "Remolacha",
    unit: UNITS.KG,
    price: 2499,
    currentStock: 10,
    minStock: 2,
  },
  {
    name: "Aceite de oliva",
    unit: UNITS.L,
    price: 23746,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Aceto balsámico",
    unit: UNITS.L,
    price: 2452.5,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Castañas de cajú",
    unit: UNITS.KG,
    price: 25379,
    currentStock: 3,
    minStock: 1,
  },
  {
    name: "Jugo de limón",
    unit: UNITS.L,
    price: 1199,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Mandioca",
    unit: UNITS.KG,
    price: 30000,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Aceite de girasol",
    unit: UNITS.L,
    price: 19350,
    currentStock: 6,
    minStock: 2,
  },
  { name: "Sal", unit: UNITS.KG, price: 3580, currentStock: 10, minStock: 2 },
  {
    name: "Pimienta",
    unit: UNITS.KG,
    price: 56340,
    currentStock: 2,
    minStock: 0.5,
  },
  { name: "Ajo", unit: UNITS.KG, price: 2000, currentStock: 3, minStock: 1 },
  {
    name: "Portobellos",
    unit: UNITS.KG,
    price: 36495,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Champiñones",
    unit: UNITS.KG,
    price: 27999,
    currentStock: 5,
    minStock: 1,
  },
  {
    name: "Huevos",
    unit: UNITS.KG,
    price: 29000,
    currentStock: 4,
    minStock: 1,
  },
  {
    name: "Crema de leche",
    unit: UNITS.L,
    price: 2490,
    currentStock: 6,
    minStock: 2,
  },
  {
    name: "Queso brie",
    unit: UNITS.KG,
    price: 18700,
    currentStock: 3,
    minStock: 1,
  },
  {
    name: "Almendras",
    unit: UNITS.KG,
    price: 27398,
    currentStock: 3,
    minStock: 1,
  },
  { name: "Leche", unit: UNITS.L, price: 2290, currentStock: 10, minStock: 2 },
  {
    name: "Manteca",
    unit: UNITS.KG,
    price: 25050,
    currentStock: 4,
    minStock: 1,
  },
];

const MEALS = [
  {
    name: "Tartar de remolachas asadas al rescoldo, emulsión de cajú alimonada y chips de mandioca",
    price: 9500,
    minStock: 3,
    category: ["Vegetariano", "Entrada", "Sin TACC"],
    description:
      "Tartar de remolachas asadas, emulsión de cajú alimonada y chips de mandioca crujientes.",
    image: "1793073953976-750247002.jpg",
    ingredients: [
      { supply: "Remolacha", quantity: 0.16 },
      { supply: "Aceite de oliva", quantity: 0.005 },
      { supply: "Aceto balsámico", quantity: 0.005 },
      { supply: "Castañas de cajú", quantity: 0.035 },
      { supply: "Jugo de limón", quantity: 0.01 },
      { supply: "Mandioca", quantity: 0.025 },
      { supply: "Aceite de girasol", quantity: 0.01 },
      { supply: "Sal", quantity: 0.002 },
      { supply: "Pimienta", quantity: 0.001 },
      { supply: "Ajo", quantity: 0.003 },
    ],
  },
  {
    name: "Flan de hongos silvestres (portobellos y champiñones) con crema ligera de queso brie y crocante de almendras",
    price: 11500,
    minStock: 3,
    category: ["Vegetariano", "Entrada", "Gourmet"],
    description:
      "Medallón/terrina de flan de hongos silvestres, crema ligera de queso brie y crocante de almendras.",
    image: "1793395900580-20381333.jpg",
    ingredients: [
      { supply: "Portobellos", quantity: 0.06 },
      { supply: "Champiñones", quantity: 0.05 },
      { supply: "Huevos", quantity: 0.02 },
      { supply: "Crema de leche", quantity: 0.05 },
      { supply: "Aceite de oliva", quantity: 0.005 },
      { supply: "Sal", quantity: 0.002 },
      { supply: "Pimienta", quantity: 0.001 },
      { supply: "Queso brie", quantity: 0.03 },
      { supply: "Almendras", quantity: 0.015 },
      { supply: "Leche", quantity: 0.02 },
      { supply: "Manteca", quantity: 0.005 },
    ],
  },
];

async function seedUsers() {
  for (const userData of USERS) {
    const userName = await User.generateUniqueUserName(
      userData.name,
      userData.lastName,
    );
    const existing = await User.findOne({ userName, status: "activo" });
    if (existing) {
      console.log(`Usuario ya existente: ${userName} (se omite)`);
      continue;
    }

    const { salt, passwordHash } = User.generateSafePassword(userData.password);

    await User.create({
      userName,
      name: userData.name,
      lastName: userData.lastName,
      role: userData.role,
      salt,
      passwordHash,
    });

    console.log(
      `Usuario creado -> [${userData.role}] usuario: ${userName} | contraseña: ${userData.password}`,
    );
  }
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

  await seedUsers();
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

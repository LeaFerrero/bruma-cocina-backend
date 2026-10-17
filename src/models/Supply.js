import mongoose from "mongoose";
import { VALID_UNITS } from "../constants/units.js";
import { parseDecimal } from "../utils/parsers.js";

const supplySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      unique: true,
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "La unidad de medida esobligatira"],
      enum: {
        values: VALID_UNITS,
        message: "{VALUE} no es una unidad de medida válida para el sistema",
      },
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatiorio."],
      min: [0, "El precio no puede ser negativo"],
      set: (value) => parseDecimal(value, 2),
    },
    currentStock: {
      type: Number,
      required: [true, "El stock actual es obligatorio"],
      min: [0, "El stock actual no puede ser negativo"],
      set: (value) => parseDecimal(value, 3),
    },
    minStock: {
      type: Number,
      required: [true, "El stock minimo es obligatorio"],
      min: [0, "El stock minimo no puede ser negativo"],
      set: (value) => parseDecimal(value, 3),
    },
    status: {
      type: String,
      default: "activo",
      enum: {
        values: ["activo", "eliminado"],
        message: "{VALUE} no es un estado válido",
      },
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Supply = mongoose.model("Supply", supplySchema);

export default Supply;

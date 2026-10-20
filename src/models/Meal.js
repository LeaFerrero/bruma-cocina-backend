import mongoose from "mongoose";
import { parseDecimal } from "../utils/parsers.js";

const mealSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatiorio."],
      min: [0.01, "El precio tiene que ser mayor a 0"],
      set: (value) => parseDecimal(value, 2),
    },

    category: {
      type: [String],
      required: [true, "La categoría es obligatoria"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Debe ingresar al menos una categoría válida",
      },
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      min: [10, "La descripción debe tener al menos 10 caracteres"],
      max: [250, "La descripción debe como máximo 250 caracteres"],
    },

    ingredients: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supply",
          },
          quantity: {
            type: Number,
            required: [true, "La cantidad es obligatoria"],
            min: [0.001, "La cantidad tiene que ser mayor a 0"],
            set: (value) => parseDecimal(value, 3),
          },
        },
      ],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Debe agregar al menos un ingrediente a la receta",
      },
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

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;

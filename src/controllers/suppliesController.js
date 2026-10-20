import Supply from "../models/Supply.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getSupplies = async (req, res, next) => {
  try {
    const activeSupplies = await Supply.find({
      status: "activo",
    });

    return sendSuccess(res, 200, "Insumos listados con éxito", activeSupplies);
  } catch (error) {
    next(error);
  }
};

const getSupplyById = async (req, res, next) => {
  try {
    const supply = await Supply.findById(req.params.id);

    if (!supply || supply.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    return sendSuccess(res, 200, "Insumo encontrado", supply);
  } catch (error) {
    next(error);
  }
};

const createSupply = async (req, res, next) => {
  try {
    const { name, price, unit, currentStock, minStock, category } = req.body;

    const newSupply = await Supply.create({
      name,
      price,
      unit,
      currentStock,
      minStock,
      category,
    });

    return sendSuccess(res, 201, "Insumo creado con éxito", {
      supply: newSupply,
    });
  } catch (error) {
    next(error);
  }
};

const editSupply = async (req, res, next) => {
  try {
    const { name, price, unit, currentStock, minStock, category } = req.body;

    const supply = await Supply.findById(req.params.id);

    if (!supply || supply.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    if (name !== undefined) supply.name = name;
    if (price !== undefined) supply.price = price;
    if (unit !== undefined) supply.unit = unit;
    if (currentStock !== undefined) supply.currentStock = currentStock;
    if (minStock !== undefined) supply.minStock = minStock;
    if (category !== undefined) supply.category = category;

    if (!supply.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        supply: supply,
      });
    }

    await supply.save();

    return sendSuccess(res, 200, "Insumo actualizado", {
      supply: supply,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSupply = async (req, res, next) => {
  try {
    const supply = await Supply.findById(req.params.id);

    if (!supply || supply.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    supply.status = "eliminado";
    await supply.save();

    return sendSuccess(res, 200, "Insumo eliminado con éxito", {
      supply: supply,
    });
  } catch (error) {
    next(error);
  }
};

const addStock = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError(
        "La lista de insumos está vacía o tiene un formato inválido",
        400,
        null,
        ERROR_CODES.BAD_REQUEST,
      );
    }

    const errors = {};
    const suppliesToUpdate = [];

    for (let i = 0; i < items.length; i++) {
      const supply = await Supply.findById(items[i]._id);

      if (!supply || supply.status === "eliminado") {
        errors[`${i}._id`] =
          `El insumo "${items[i].name || items[i]._id}" no existe o fue eliminado.`;
      } else {
        suppliesToUpdate.push({
          document: supply,
          quantityToAdd: parseFloat(items[i].quantity),
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(
        "Algunos insumos de la lista no son válidos.",
        404,
        errors,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    const updateSupplies = [];

    for (const { document, quantityToAdd } of suppliesToUpdate) {
      document.currentStock += quantityToAdd;
      await document.save();

      updateSupplies.push({
        id: document._id,
        name: document.name,
        currentStock: document.currentStock,
      });
    }

    return sendSuccess(res, 200, "Stock ingresado con éxito", updateSupplies);
  } catch (error) {
    next(error);
  }
};

export {
  getSupplies,
  getSupplyById,
  createSupply,
  editSupply,
  deleteSupply,
  addStock,
};

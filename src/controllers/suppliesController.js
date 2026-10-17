import Supply from "../models/Supply.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getSupplies = async (req, res, next) => {
  try {
    const activeSupplys = await Supply.find({
      status: "activo",
    });

    return sendSuccess(res, 200, "Insumos listados con éxito", activeSupplys);
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
    const { ...supplyData } = req.body;

    const newSupply = new Supply({
      ...supplyData,
    });

    await newSupply.save();

    return sendSuccess(res, 201, "Insumo creado con éxito", {
      supplyName: newSupply.name,
    });
  } catch (error) {
    next(error);
  }
};

const editSupply = async (req, res, next) => {
  try {
    const { ...supplyData } = req.body;

    const supply = await Supply.findById(req.params.id);

    if (!supply || supply.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    supply.set(supplyData);

    if (!supply.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        supplyName: supply.name,
      });
    }

    await supply.save();

    return sendSuccess(res, 200, "Insumo actualizado", {
      supplyName: supply.name,
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

    return sendSuccess(res, 200, "Insumo eliminado con éxito");
  } catch (error) {
    next(error);
  }
};

export { getSupplies, getSupplyById, createSupply, editSupply, deleteSupply };

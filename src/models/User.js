import mongoose from "mongoose";
import { VALID_ROLES } from "../constants/roles.js";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "El rol es obligatorio"],
      enum: {
        values: VALID_ROLES,
        message: "{VALUE} no es un rol válido para el sistema",
      },
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
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

userSchema.statics.generateSafePassword = function (password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, passwordHash };
};

userSchema.statics.generateUniqueUserName = async function (name, lastName) {
  const baseUserName = `${name}.${lastName}`.toLowerCase();
  let finalUserName = baseUserName;
  let counter = 1;
  let user = await this.findOne({ userName: finalUserName });

  while (user) {
    finalUserName = `${baseUserName}.${counter}`;
    counter++;
    user = await this.findOne({ userName: finalUserName });
  }

  return finalUserName;
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
  return this.passwordHash === hash;
};

const User = mongoose.model("User", userSchema);

export default User;

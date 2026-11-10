import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginUserService,
  registerUserService,
} from "../services/userservice.ts";
import requestCheckPkg from "request-check";
import isness from "@zarco/isness";
import throwlhos from "../utils/throwlhos.ts";

const requestCheck = requestCheckPkg.default;
const rc = requestCheck();

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body;

    const errors = rc.check({ email }, { password }, { name });
    if (errors) return res.send_badRequest("Requisição inválida", errors);

    if (!isness.email(email))
      return res.send_badRequest("Email precisar ser um email");

    await registerUserService(name, email, password);
    return res.send_created("Usuário Registrado");
  } catch (error) {
    return next(error);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    if (!isness.email(email))
      return res.send_badRequest("Email precisar ser um email");
    const errors = rc.check({ email }, { password });
    if (errors) return res.send_badRequest("Requisição inválida", errors);

    const result = await loginUserService(email, password);

    return res.send_ok("Login realizado", result);
  } catch (error) {
    return next(error);
  }
}

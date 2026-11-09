import { Request, Response } from "express";
import bcrypt from "npm:bcrypt";
import jwt from "npm:jsonwebtoken@^9.0.2";
import {
  loginUserService,
  registerUserService,
} from "../services/userservice.ts";
import requestCheckPkg from "npm:request-check";
import isness from "@zarco/isness";
const requestCheck = requestCheckPkg.default; // Pega a função construtora real
const rc = requestCheck();
export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const errors = rc.check({ email }, { password }, { name });
    if (errors) return res.send_badRequest("Requisição inválida", errors);

    if (!isness.email(email))
      return res.send_badRequest("Email precisar ser um email");

    const bpass = await bcrypt.hash(password, 10);
    const result = await registerUserService(name, email, bpass);
    // um usuario pode ter varias contas com o mesmo email, precisa consertar

    if (result) {
      return res.send_created("Usuário registrado");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.sendbadRequest("Erro ao registrar usuário", error);
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!isness.email(email))
      return res.send_badRequest("Email precisar ser um email");
    const errors = rc.check({ email }, { password });
    if (errors) return res.send_badRequest("Requisição inválida", errors);

    const result = await loginUserService(email);

    if (!result || result.length === 0) {
      return res.send_badRequest("Usuário não encontrado ou senha incorreta");
    }

    const user = result[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.send_badRequest("Usuário ou senha incorretos");
    }

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    const SECRET = Deno.env.get("JWT_SECRET");
    const payload = { userID: user.id, email: user.email, role: user.role };
    const token = await jwt.sign(payload, SECRET, { expiresIn: "2h" });

    return res.send_ok("Login realizado", { token, userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.send_badRequest("erro ao logar usuário", error);
  }
}

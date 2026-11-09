import { Request, Response } from "express";
import bcrypt from "npm:bcrypt";
import jwt from "npm:jsonwebtoken";
import {
  loginUserService,
  registerUserService,
} from "../services/userservice.ts";

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Missing required fields for register" });
    }
    const bpass = await bcrypt.hash(password, 10);

    const result = await registerUserService(name, email, bpass);
    // um usuario pode ter varias contas com o mesmo email, precisa consertar
    if (result) {
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields for login" });
    }
    const result = await loginUserService(email);

    if (!result || result.length == 0) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }
    const user = result[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }
    const userObj = user.toObject ? user.toObject() : user;
    const { password:  _, ...userWithoutPassword } = userObj;
    const SECRET = Deno.env.get("JWT_SECRET");
    const payload = { userID: user.id, email: user.email };
    const token = await jwt.sign(payload, SECRET, { expiresIn: "2h" });
    return res
      .status(200)
      .json({ message: "Usuário logado", userWithoutPassword, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "erro ao logar usuário" });
  }
}

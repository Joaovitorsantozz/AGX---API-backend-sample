import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import throwlhos from "../utils/throwlhos.ts";

export default function AuthenticateToken(options: { adminOnly: boolean }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.get("authorization")?.split(" ")[1];
    if (!token)
      return next(
        throwlhos.err_unauthorized(
          "Você não está logado ou autorizado para fazer essa ação",
        ),
      );
    const secret = Deno.env.get("JWT_SECRET");
    if (!secret) return next(new Error("JWT não configurado"));

    let decoded: { userID: string; email: string; role: string };
    try {
      decoded = jwt.verify(token, secret) as typeof decoded;
    } catch {
      return next(
        throwlhos.err_unauthorized("Você não tem permissão para essa ação"),
      );
    }

    if (options.adminOnly && decoded.role != "admin") {
      return next(
        throwlhos.err_unauthorized("Token inválida ou permissão negada"),
      );
    }

    res.locals.user=decoded;
   
    return next();
  };
}

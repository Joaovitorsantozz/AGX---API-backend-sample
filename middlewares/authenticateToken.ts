import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

export default function AuthenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.get("authorization")?.split(" ")[1];
  if (!token)
    return res.send_unauthorized(
      "Você não está logado ou autorizado para fazer essa ação",
    );
  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) return next(new Error("JWT não configurado"));
  try {
    res.locals.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res.send_forbidden("Você não tem permissão para essa ação");
  }
}

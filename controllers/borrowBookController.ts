import { Request, Response, NextFunction } from "express";
import rc from "../utils/rc.ts";
import {
  borrowBookService,
  returnBookService,
} from "../services/borrowBookService.ts";
import { JWTPayload } from "../utils/JWTPayload.ts";
export async function borrowBookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { isbn } = req.body;
  const user = res.locals.user as unknown as JWTPayload;
  const userId = user.userID;
  const errors = rc.check({ isbn, userId });

  if (errors) {
    return res.send_badRequest("ISBN inválido ou inexistente");
  }
  try {
    const result = await borrowBookService(userId, isbn);

    return res.send_created("Livro emprestado", result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export async function returnBookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { isbn } = req.body;
  const user = res.locals.user as unknown as JWTPayload;
  const userId = user.userID;
  const errors = rc.check({ isbn, userId });
  if (errors) return res.send_badRequest("ISBN inválido ou inexistente");
  console.log("user id", userId);
  try {
    const result = await returnBookService(userId, isbn);

    return res.send_created("Livro devolvido", result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

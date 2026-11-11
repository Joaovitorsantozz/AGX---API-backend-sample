import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../utils/JWTPayload.ts";
import { userBorrowedBooksService } from "../services/userBookBorrowedService.ts";

export async function userBooksBorrowedController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = res.locals.user as unknown as JWTPayload;
    const userID = user.userID;

    const orders = await userBorrowedBooksService(userID);

    return res.send_ok("Histórico de livros", { orders, count: orders.length });
  } catch (error) {
    next(error);
  }
}

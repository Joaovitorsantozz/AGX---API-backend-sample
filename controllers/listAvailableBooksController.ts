import { Request, Response, NextFunction } from "express";

import { getAvailableBooksService } from "../services/listAvailableBooksService.ts";



export async function getAvailableBooksController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const books = await getAvailableBooksService();
    res.send_ok("Livros encontrados", books);
  } catch (error) {
    console.log("error");
    return next(error);
  }
}

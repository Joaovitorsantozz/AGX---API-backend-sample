import { Request, Response, NextFunction } from "express";
import registerBookService, {
  findBookByISBN,
} from "../services/bookservice.ts";
import rc from "../utils/rc.ts";

export default async function registerBookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, price, author, genre, status, isbn, publishedYear } =
      req.body;
    const errors = rc.check(
      { name },
      { price },
      { author },
      { genre },
      { status },
      { isbn },
      { publishedYear },
    );

    if (errors) {
      return res.send_badRequest("Requisição inválida", errors);
    }
    const result = await  registerBookService(
      name,
      price,
      author,
      genre,
      status,
      isbn,
      publishedYear,
    );
    return res.send_created("Livro registrado", result);
  } catch (err) {
    return next(err);
  }
}

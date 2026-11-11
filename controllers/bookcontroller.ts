import { Request, Response, NextFunction } from "express";

import rc from "../utils/rc.ts";
import registerBookService, {
  deleteBookService,
} from "../services/bookservice.ts";

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
    const result = await registerBookService(
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
export async function deleteBookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { isbn } = req.body;
  const errors = rc.check({ isbn });

  if (errors)
    return res.send_badRequest("ISBN não encontrado para essa operação");

  try {
    const result = await deleteBookService(isbn);
    return res.send_ok("Livro deletado", result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

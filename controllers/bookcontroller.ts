import { Request, Response, NextFunction } from "express";
import requestCheckPkg from "request-check";
import registerBookService from "../services/bookservice.ts";
const requestCheck = requestCheckPkg.default;
const rc = requestCheck();
export default async function registerBookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, price, author, genre, status, publishedYear } = req.body;
    const errors = rc.check({
      name,
      price,
      author,
      genre,
      status,
      publishedYear,
    });
    if (errors) {
      return res.send_badRequest("Requisição inválida", errors);
    }
    await registerBookService(
      name,
      price,
      author,
      genre,
      status,
      publishedYear,
    );

    return res.send_created("Livro registrado");
  } catch (err:any) {
    return res.send_badRequest(
      err.message ?? "Erro ao registrar livro",
      err.errors,
    );
  }
}

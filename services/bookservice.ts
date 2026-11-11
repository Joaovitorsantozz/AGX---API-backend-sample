
import throwlhosModule from "throwlhos";
import {
  findByIsbn,
  registerBookRepository,
} from "../repository/bookRepository.ts";

const throwlhos = throwlhosModule.default;
export default async function registerBookService(
  name: string,
  price: number,
  author: string,
  genre: string,
  status: "available" | "borrowed",
  isbn: string,
  publishedYear: number,
) {
  const thereIsAnExistedBookAlready = await findByIsbn(isbn);

  if (thereIsAnExistedBookAlready)
    throw throwlhos.err_conflict("Já existe um livro cadastrado com esse ISBN");

  return await registerBookRepository({
    name,
    price,
    author,
    genre,
    status,
    isbn,
    publishedYear,
  });
}

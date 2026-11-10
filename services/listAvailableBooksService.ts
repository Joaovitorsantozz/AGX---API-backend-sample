import { listAvailableBooksRepository } from "../repository/bookRepository.ts";
import throwlhos from "../utils/throwlhos.ts";

export async function getAvailableBooksService() {
  const books = await listAvailableBooksRepository();
  if (!books || books.length == 0)
    throw throwlhos.err_notFound("nenhum livro disponível");
  return books;
}

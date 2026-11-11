import throwlhosModule from "throwlhos";
import {
  deleteBook,
  deleteBookWithExistingOrder,
  findByIsbn,
  registerBookRepository,
} from "../repository/bookRepository.ts";
import mongoose from "mongoose";
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

export async function deleteBookService(isbn: string) {
  // tem dois problemas
  // precisa primeiro excluir o livro da tabela de orders caso exista
  // precisa excluir o livro da tabela de livros
  // o correto é ser feito em transação
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const book = await findByIsbn(isbn);
      if (!book) {
        throw throwlhos.err_notFound("Livro não encontrado");
      }
      await deleteBookWithExistingOrder(book._id, session);
      const deletedBook = await deleteBook(book._id, session);
      if (!deletedBook) throw throwlhos.err_notFound("Livro não encontrado");
      return { message : "Livro deleteado com sucesso"};
    });
  } finally {
    session.endSession();
  }
}

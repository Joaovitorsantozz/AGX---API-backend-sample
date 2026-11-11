import Books from "../models/bookSchema.ts";
import {
  findActiveOrder,
  findByIsbn,
  updateBookStatus,
  updateReturnOrder,
} from "../repository/bookRepository.ts";
import throwlhos from "../utils/throwlhos.ts";
import mongoose from "mongoose";
import {
  markAsBorrowedIsbn,
  createOrder,
} from "../repository/bookRepository.ts";

export async function borrowBookService(userId: string, isbn: string) {
  // precisa ver se existe o livro primeiro
  // começa a transação

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const existing = await findByIsbn(isbn, session);
      if (!existing) throw throwlhos.err_notFound("Livro não achado");

      const book = await markAsBorrowedIsbn(isbn, session);
      if (!book) throw throwlhos.err_conflict("Livro ja emprestado");

      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return await createOrder(
        { user: userId, book: book._id, dueDate },
        session,
      );
    });
  } finally {
    await session.endSession();
  }
}

export async function returnBookService(userId: string, isbn: string) {
  const session = await mongoose.startSession();
  //previsa ver se o id do usuario que ta devolvendo o livro é o mesmo do que pegou
  try {
    return await session.withTransaction(async () => {
      const book = await findByIsbn(isbn);
      if (!book) throw throwlhos.err_notFound("livro não encontrado");
      const existingOrder = await findActiveOrder(
        {user:userId, book: book._id.toString() },
        session,
      );
      if (!existingOrder)
        throw throwlhos.err_notFound(
          "Livro não encontrado na tabela de alugados",
        );

      const updatedOrder = await updateReturnOrder(
        existingOrder._id.toString(),
        session,
      );
      await updateBookStatus(book._id.toString(), "available", session);

      return { message: "Livro Devolvido com sucesso", order: updatedOrder };
    });
  } finally {
    await session.endSession();
  }
}

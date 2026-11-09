import Books from "../models/bookSchema.ts";
import throwlhosModule from "throwlhos";

const throwlhos = throwlhosModule.default;
export default async function registerBookService(
  name: string,
  price: number,
  author: string,
  genre: string,
  status: "available" | "sold" | "reserved",
  publishedYear: number,
 
) {
  try {
    const newBook = await Books.create({
      name,
      price,
      author,
      genre,
      status,
      publishedYear,
    });
    return newBook;
  } catch (error) {
    throw throwlhos.err_badRequest("Dados do livro inválidos.");
  }
}

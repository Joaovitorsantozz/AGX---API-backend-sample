import Books from "../models/bookSchema.ts";
import throwlhosModule from "throwlhos";

const throwlhos = throwlhosModule.default;
export default async function registerBookService(
  name: string,
  price: number,
  author: string,
  genre: string,
  status: "available" | "sold" | "reserved",
  isbn:string,
  publishedYear: number,
 
) {
  try {
    const newBook = await Books.create({
      name,
      price,
      author,
      genre,
      status,
      isbn,
      publishedYear,
    });
    return newBook;
  } catch (error) {
    console.log(error);
    throw throwlhos.err_badRequest("Dados do livro inválidos.");
    // pelo o que eu entendi aqui ele chama throwlhos diretamente por que não tem como tratar com req e res
  }
}

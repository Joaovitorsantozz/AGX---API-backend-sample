import Books from "../models/bookSchema.ts";

export async function registerBookRepository(data: {
  name: string;
  price: number;
  author: string;
  genre: string;
  status: "available" | "borrowed";
  isbn: string;
  publishedYear: number;
}) {
  return await Books.create(data);
}

export async function findBookByISBN(isbn: string) {
  const result = await Books.find({ isbn });
  return result;
}

export async function listAvailableBooksRepository() {
  return await Books.find(
    { status: "available" },
    "name isbn author genre status publishedYear",
  );
}

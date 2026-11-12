import Books from "../models/bookSchema.ts";
import { ClientSession, Types } from "mongoose";
import { Order } from "../models/orderSchema.ts";
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

export async function findByIsbn(isbn: string, session?: ClientSession) {
  const res = await Books.findOne({ isbn }).session(session ?? null);

  return res;
}
export async function findBookByID(id: string) {
  return await Books.find({ id });
}
export async function listAvailableBooksRepository() {
  return await Books.find(
    { status: "available" },
    "name isbn author genre status publishedYear",
  );
}

export async function markAsAvailableIsbn(
  isbn: string,
  session: ClientSession,
) {
  return await Books.findOneAndUpdate(
    { isbn, status: "borrowed" },
    { $set: { status: "available" } },
    { returnDocument: "after", session },
  );
}

export async function markAsBorrowedIsbn(isbn: string, session: ClientSession) {
  return await Books.findOneAndUpdate(
    { isbn, status: "available" },
    { $set: { status: "borrowed" } },
    { returnDocument: "after", session },
  );
}

export async function createOrder(
  data: { user: string; book: Types.ObjectId; isbn?: string; dueDate: Date },
  session: ClientSession,
) {
  const [order] = await Order.create([data], { session });
  return order;
}

export async function findActiveOrder(
  data: { user: string; book: string },
  session: ClientSession,
) {
  return await Order.findOne({
    user: data.user,
    book: data.book,
    status: "active",
  }).session(session);
}
export async function deleteBookWithExistingOrder(
  bookId: Types.ObjectId,
  session: ClientSession,
) {
  return await Order.deleteMany({ book: bookId }).session(session);
}
export async function deleteBook(
  bookId: Types.ObjectId,
  session: ClientSession,
) {
  return await Books.findByIdAndDelete(bookId).session(session);
}
export async function updateReturnOrder(
  orderId: string,
  session: ClientSession,
) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    { status: "returned", returnedAt: new Date() },
    { returnDocument: "after", session },
  );

  return order;
}

export async function updateBookStatus(
  bookId: string,
  status: string,
  session: ClientSession,
) {
  const order = await Books.findByIdAndUpdate(
    bookId,
    { $set: { status } },
    { returnDocument: "after", session },
  );
  return order;
}

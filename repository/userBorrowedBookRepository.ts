
import { Order } from "../models/orderSchema.ts";
export async function userBorrowedBookRepository(userID: string ){
    const orders = await Order.find({user:userID}).populate("book").sort({createdAt:-1});
    return orders;
}
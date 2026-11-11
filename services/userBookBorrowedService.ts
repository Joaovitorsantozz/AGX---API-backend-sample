import { userBorrowedBookRepository } from "../repository/userBorrowedBookRepository.ts";

export async function userBorrowedBooksService(userID:string){
    const result = await userBorrowedBookRepository(userID);
    return result;
}
import express from 'express';
import registerBookController, { deleteBookController } from "../controllers/bookcontroller.ts";
import AuthenticateToken from "../middlewares/authenticateToken.ts";
import { getAvailableBooksController } from "../controllers/listAvailableBooksController.ts";
import { borrowBookController, returnBookController } from "../controllers/borrowBookController.ts";
import { userBooksBorrowedController } from "../controllers/usersBooksBorrowedController.ts";


const router = express.Router();

router.post("/api/books/register",AuthenticateToken({adminOnly:true}),registerBookController);
router.get("/api/books/show",AuthenticateToken({adminOnly:false}),getAvailableBooksController);
router.post("/api/books/borrow",AuthenticateToken({adminOnly:false}),borrowBookController)
router.patch("/api/books/return",AuthenticateToken({adminOnly:false}),returnBookController);
router.get("/api/books/user/borrowed",AuthenticateToken({adminOnly:false}),userBooksBorrowedController);
router.delete("/api/books/delete",AuthenticateToken({adminOnly:true}),deleteBookController);
export default router;
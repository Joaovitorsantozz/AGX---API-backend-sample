import express from 'express';
import registerBookController from "../controllers/bookcontroller.ts";
import AuthenticateToken from "../middlewares/authenticateToken.ts";
import { getAvailableBooksController } from "../controllers/listAvailableBooksController.ts";


const router = express.Router();

router.post("/api/books/register",AuthenticateToken,registerBookController);
router.get("/api/books/show",AuthenticateToken,getAvailableBooksController);
export default router;
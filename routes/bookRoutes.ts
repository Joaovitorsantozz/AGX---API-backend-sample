import express from 'express';
import registerBookController from "../controllers/bookcontroller.ts";
import AuthenticateToken from "../middlewares/authenticateToken.ts";


const router = express.Router();

router.post("/api/books/register",AuthenticateToken,registerBookController);

export default router;
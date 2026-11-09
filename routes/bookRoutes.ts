import express from 'express';
import registerBookController from "../controllers/bookcontroller.ts";


const router = express.Router();

router.post("/api/books/register",registerBookController);

export default router;
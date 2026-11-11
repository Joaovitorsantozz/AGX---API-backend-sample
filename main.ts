import express from "express";
import morgan from "morgan";
import { connectToDatabase } from "./database.ts";
import userRoutes from "./routes/userRoutes.ts";
import bookRoutes from "./routes/bookRoutes.ts";
import responserPkg from 'responser';

import ResponserrorPkg from "responserror";
import throwlhos from "./utils/throwlhos.ts";

const Responserror = ResponserrorPkg.default ?? ResponserrorPkg;
const { errorHandler } = new Responserror();
const app = express();

const responser = responserPkg.default;

app.use(express.json());
app.use(morgan("dev"));

app.use(responser);


app.use(userRoutes);
app.use(bookRoutes);

app.use(throwlhos.middleware);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
connectToDatabase();

/*
a principio vai ter

login registro

admin registra novos livros

usuario seleciona um livro em transação

*/

// nas services nao se usa o next por que nao tem acesso ao contexto req res se usa throw (throwlhos as any).err("erro")
// nas controllers no catch so por next(err) vai pro handler
//rc check aparentemente so serve pras respostas que vem no corpo da requisição



// separar melhor controller service e repository
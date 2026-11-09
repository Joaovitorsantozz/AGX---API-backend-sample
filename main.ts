import express from "express";
import morgan from "morgan";
import { connectToDatabase } from "./database.ts";
import userRoutes from "./routes/userRoutes.ts";
import bookRoutes from "./routes/bookRoutes.ts";
import responserPkg from 'responser';
import throwlhosModule from "throwlhos";
import errorHandler from "npm:responserror";
const app = express();
const throwlhos = throwlhosModule.default;
const responser = responserPkg.default;

app.use(express.json());
app.use(morgan("dev"));

app.use(responser);


app.use(userRoutes);
app.use(bookRoutes);
app.use(errorHandler.default ?? errorHandler);
app.use(throwlhos.middleware);

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

// preciso verificar melhor esse tratamento de erro

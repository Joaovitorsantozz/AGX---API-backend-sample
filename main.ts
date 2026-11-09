import express from "express";
import morgan from "npm:@types/morgan@^1.9.10"
import { connectToDatabase } from "./database.ts";
import userRoutes from "./routes/userRoutes.ts";
import responserPkg from 'npm:responser';
import throwlhos from 'throwlhos'
const app = express();
const responser = responserPkg.default;
app.use(morgan("dev"));
app.use(throwlhos);
app.use(responser)
app.use(express.json());
app.use(userRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
connectToDatabase();
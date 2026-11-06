import express from "express";

import { connectToDatabase } from "./database.ts";
import userRoutes from "./routes/userRoutes.ts";
const app = express();
app.use(express.json());
app.use(userRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
connectToDatabase();
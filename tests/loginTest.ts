
import { assertEquals } from "@std/assert";
import { connectToDatabase } from "../database.ts";
import mongoose from "mongoose";

import app from "../main.ts";

Deno.test("POST /login", async (t) => {
  await connectToDatabase();

  const email = `teste@gmail.com`;


  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Não foi possível iniciar o servidor");
  }

  const url = `http://localhost:${address.port}/login`;


  const logar = (dados: Record<string, unknown>) => {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  };

  try {
    await t.step("deve logar um usuário", async () => {
      const response = await logar({
        email,
        password: "123456",
      });

      assertEquals(response.status, 200);
    });

    await t.step("não deve logar sem email", async () => {
      const response = await logar({

        password: "123456",
      });

      assertEquals(response.status, 400);
    });

    await t.step("não deve cadastrar sem senha", async () => {
      const response = await logar({
        name: "Usuário Teste",
      });

      assertEquals(response.status, 400);
    });

 

    await t.step("não deve aceitar email inválido", async () => {
      const response = await logar({
        name: "Usuário Teste",
        email: "email-invalido",
        password: "123456",
      });

      assertEquals(response.status, 400);
    });

    
  } finally {

    await new Promise<void>((resolve, reject) => {
      server.close((error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });


   // await User.deleteMany({ email });

    
    await mongoose.disconnect();
  }
});


import { assertEquals } from "@std/assert";
import { connectToDatabase } from "../database.ts";
import mongoose from "mongoose";
import User from "../models/usersSchema.ts";
import app from "../main.ts";

Deno.test("POST /register", async (t) => {
  await connectToDatabase();

  const email = `teste-${crypto.randomUUID()}@email.com`;


  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Não foi possível iniciar o servidor");
  }

  const url = `http://localhost:${address.port}/register`;


  const cadastrar = (dados: Record<string, unknown>) => {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  };

  try {
    await t.step("deve cadastrar um usuário", async () => {
      const response = await cadastrar({
        name: "Usuário Teste",
        email,
        password: "123456",
      });

      assertEquals(response.status, 201);
    });

    await t.step("não deve cadastrar sem nome", async () => {
      const response = await cadastrar({
        email: `nome-${crypto.randomUUID()}@email.com`,
        password: "123456",
      });

      assertEquals(response.status, 400);
    });

    await t.step("não deve cadastrar sem email", async () => {
      const response = await cadastrar({
        name: "Usuário Teste",
        password: "123456",
      });

      assertEquals(response.status, 400);
    });

    await t.step("não deve cadastrar sem senha", async () => {
      const response = await cadastrar({
        name: "Usuário Teste",
        email: `senha-${crypto.randomUUID()}@email.com`,
      });

      assertEquals(response.status, 400);
    });

    await t.step("não deve aceitar email inválido", async () => {
      const response = await cadastrar({
        name: "Usuário Teste",
        email: "email-invalido",
        password: "123456",
      });

      assertEquals(response.status, 400);
    });

    await t.step("não deve cadastrar email duplicado", async () => {
      const response = await cadastrar({
        name: "Outro Usuário",
        email,
        password: "123456",
      });

      assertEquals(response.status, 409);
    });
  } finally {

    await new Promise<void>((resolve, reject) => {
      server.close((error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });


    await User.deleteMany({ email });

    
    await mongoose.disconnect();
  }
});

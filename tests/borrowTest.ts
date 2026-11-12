
import { assertEquals } from "@std/assert";
import { connectToDatabase } from "../database.ts";
import mongoose from "mongoose";
import app from "../main.ts";
import {
  createBook,
  loginAdmin,
  loginCustomer,
} from "./helpers.ts";

Deno.test("Testes de empréstimo e devolução de livros", async (t) => {
  await connectToDatabase();

  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Não foi possível iniciar o servidor");
  }

  const base = `http://localhost:${address.port}`;

  try {
    const adminToken = await loginAdmin(base);
    const customerToken = await loginCustomer(base);

    const adminHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    };

    const customerHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    };

    const livro = await createBook(base, adminToken);

    const borrowURL = `${base}/api/books/borrow`;
    const returnURL = `${base}/api/books/return`;
    const borrowedURL = `${base}/api/books/user/borrowed`;



    await t.step("não deve emprestar sem token", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve emprestar sem ISBN", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({}),
      });

      assertEquals(res.status, 400);
    });

    await t.step("não deve emprestar ISBN inexistente", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({ isbn: "ISBN-INEXISTENTE-123" }),
      });

      assertEquals(res.status, 404);
    });

    await t.step("deve conseguir emprestar livro", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 201);
    });

    await t.step("não deve emprestar livro já emprestado", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 409);
    });

  

    await t.step("deve listar livros emprestados pelo usuário", async () => {
      const res = await fetch(borrowedURL, {
        method: "GET",
        headers: customerHeader,
      });

      assertEquals(res.status, 200);
    });

    await t.step("não deve listar empréstimos sem token", async () => {
      const res = await fetch(borrowedURL);

      assertEquals(res.status, 401);
    });



    await t.step("não deve devolver sem token", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve devolver sem ISBN", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: customerHeader,
        body: JSON.stringify({}),
      });

      assertEquals(res.status, 400);
    });

    await t.step("não deve devolver livro emprestado por outro usuário", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: adminHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 404);
    });

    await t.step("deve conseguir devolver livro", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: customerHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 201);
    });

    await t.step("não deve devolver livro que já foi devolvido", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: customerHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 404);
    });

    

    await fetch(`${base}/api/books/delete`, {
      method: "DELETE",
      headers: adminHeader,
      body: JSON.stringify({ isbn: livro.isbn }),
    });

  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await mongoose.disconnect();
  }
});

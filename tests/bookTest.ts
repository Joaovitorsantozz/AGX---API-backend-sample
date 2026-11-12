
import { assertEquals } from "@std/assert";
import { connectToDatabase } from "../database.ts";
import mongoose from "mongoose";
import app from "../main.ts";
import { loginAdmin, loginCustomer } from "./helpers.ts";

Deno.test("Testes das rotas de livros", async (t) => {
  await connectToDatabase();

  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  

  const base = `http://localhost:${address.port}`;

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

  const livro = {
    name: "Livro teste",
    price: 99,
    author: "Author Teste",
    genre: "Romance",
    status: "available",
    isbn: `TESTE-${crypto.randomUUID()}`,
    publishedYear: 2005,
  };

  const registerURL = `${base}/api/books/register`;
  const showURL = `${base}/api/books/show`;
  const borrowURL = `${base}/api/books/borrow`;
  const returnURL = `${base}/api/books/return`;
  const borrowedURL = `${base}/api/books/user/borrowed`;
  const deleteURL = `${base}/api/books/delete`;

  try {
    

    await t.step("deve cadastrar um livro", async () => {
      const res = await fetch(registerURL, {
        method: "POST",
        headers: adminHeader,
        body: JSON.stringify(livro),
      });

      assertEquals(res.status, 201);
    });

    await t.step("não deve cadastrar livro com ISBN duplicado", async () => {
      const res = await fetch(registerURL, {
        method: "POST",
        headers: adminHeader,
        body: JSON.stringify(livro),
      });

      assertEquals(res.status, 409);
    });

    await t.step("não deve cadastrar livro sem token", async () => {
      const res = await fetch(registerURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livro),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve cadastrar livro sem campo obrigatório", async () => {
      const { price, ...livroSemPreco } = livro;

      const res = await fetch(registerURL, {
        method: "POST",
        headers: adminHeader,
        body: JSON.stringify(livroSemPreco),
      });

      assertEquals(res.status, 400);
    });

    await t.step("não deve cadastrar livro como usuário comum", async () => {
      const res = await fetch(registerURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({
          ...livro,
          isbn: `TESTE-${crypto.randomUUID()}`,
        }),
      });

      assertEquals(res.status, 403);
    });

    

    await t.step("deve listar livros disponíveis", async () => {
      const res = await fetch(showURL, {
        method: "GET",
        headers: customerHeader,
      });

      assertEquals(res.status, 200);
    });

    await t.step("não deve listar livros sem token", async () => {
      const res = await fetch(showURL);

      assertEquals(res.status, 401);
    });

   

    await t.step("não deve emprestar livro sem token", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve emprestar livro sem ISBN", async () => {
      const res = await fetch(borrowURL, {
        method: "POST",
        headers: customerHeader,
        body: JSON.stringify({}),
      });

      assertEquals(res.status, 400);
    });

    await t.step("não deve emprestar livro com ISBN inexistente", async () => {
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

    

    await t.step("não deve devolver livro sem token", async () => {
      const res = await fetch(returnURL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve devolver livro sem ISBN", async () => {
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

  

    await t.step("não deve excluir livro sem token", async () => {
      const res = await fetch(deleteURL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 401);
    });

    await t.step("não deve excluir livro sem ISBN", async () => {
      const res = await fetch(deleteURL, {
        method: "DELETE",
        headers: adminHeader,
        body: JSON.stringify({}),
      });

      assertEquals(res.status, 400);
    });

    await t.step("não deve excluir livro com ISBN inexistente", async () => {
      const res = await fetch(deleteURL, {
        method: "DELETE",
        headers: adminHeader,
        body: JSON.stringify({ isbn: "ISBN-Teste" }),
      });

      assertEquals(res.status, 404);
    });

    await t.step("não deve excluir livro como usuário comum", async () => {
      const res = await fetch(deleteURL, {
        method: "DELETE",
        headers: customerHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 403);
    });

    await t.step("deve excluir livro com token e ISBN", async () => {
      const res = await fetch(deleteURL, {
        method: "DELETE",
        headers: adminHeader,
        body: JSON.stringify({ isbn: livro.isbn }),
      });

      assertEquals(res.status, 200);
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

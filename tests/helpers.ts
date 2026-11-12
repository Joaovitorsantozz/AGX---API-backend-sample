export function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
export async function loginAdmin(base: string): Promise<string> {
  const res = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@gmail.com", password: "123456" }),
  });
  const body = await res.json();
  const token = body.data?.token ?? body.token;
  if (!token) throw new Error("Token não encontrado: " + JSON.stringify(body));
  return token as string;
}


export async function loginCustomer(base: string): Promise<string> {
  const res = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "teste@gmail.com", password: "123456" }),
  });
  const body = await res.json();
  const token = body.data?.token ?? body.token;
  if (!token) throw new Error("Token não encontrado: " + JSON.stringify(body));
  return token as string;
}


export async function createBook(base: string, token: string) {
  const livro = {
    name: "Livro teste",
    price: 99,
    author: "Author Teste",
    genre: "Romance",
    status: "available",
    isbn: `TESTE-${crypto.randomUUID()}`,
    publishedYear: 2005,
  };
  const res = await fetch(`${base}/api/books/register`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(livro),
  });
  if (res.status !== 201) {
    throw new Error(
      `Falha ao criar livro de teste: ${res.status} ${await res.text()}`,
    );
  }
  await res.body?.cancel();
  return livro;
}

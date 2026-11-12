# AGX Library
 
API de biblioteca feita em Deno com MongoDB. Funções para cadastrar usuários, cadastrar livros (apenas admin), pegar livros emprestados e devolver.
 
Projeto do desafio Deno CRUD.
 
## Tecnologias
 
- Deno
- Express
- MongoDB com Mongoose
- JWT (jsonwebtoken) e bcryptjs pra senha
- responser, request-check, morgan, isness e throwlhos (os pacotes obrigatórios)
## Como rodar

É necessário ter o Deno instalado e um banco MongoDB (usei o Atlas)
 
Clone o projeto:
 
```
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```
 
Crie um arquivo `.env` na raiz com isso:
 
```
DB_URL=sua string de conexão do mongo
JWT_SECRET=qualquer texto grande e aleatório
```
 
Depois é só rodar:
 
```
deno task dev
```
 
O servidor sobe em http://localhost:3000
 
## Criando um admin
 
Quem se registra em `/register` vira `customer`. Pra criar um admin é necessário registra o usuário normal e depois muda o campo `role` dele pra `admin` direto na coleção `users` do MongoDB.
 
## Autenticação
 
Faz login em `/login`, pega o `token` da resposta e manda nas outras rotas no header:
 
```
Authorization: Bearer seu_token
```
 
O token dura 2 horas. Sem o token dá erro 401, e se tentar usar uma rota de admin sendo customer dá 403.
 
### Token no Postman
 
Pra não ficar copiando o token toda hora, no Postman eu fiz assim:
 
1. Criei uma variável de ambiente chamada `token`
2. Na requisição de login, no script de Post-response, coloquei:
```
const body = pm.response.json();
pm.environment.set("token", body.data.token);
```
 
3. Na collection, em Authorization, escolhi Bearer Token e coloquei `{{token}}`
Aí é só fazer o login uma vez e todas as outras requisições já usam o token.
 
## Endpoints
 
### POST /register
 
Cria um usuário.
 
```json
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```
 
Retorna 201 se deu certo, 400 se faltar campo ou o email for inválido e 409 se o email já existe.
 
### POST /login
 
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```
 
Retorna 200 com o token e os dados do usuário:
 
```json
{
  "message": "Login realizado",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "name": "João",
      "email": "joao@email.com",
      "role": "customer"
    }
  }
}
```
 
Retorna 400 se o email for inválido ou faltar campo e 401 se a senha estiver errada.
 
### POST /api/books/register (admin)
 
Cadastra um livro. O ISBN não pode repetir.
 
```json
{
  "name": "Dom Casmurro",
  "price": 39.9,
  "author": "Machado de Assis",
  "genre": "Romance",
  "status": "available",
  "isbn": "978-85-359-0277-5",
  "publishedYear": 1899
}
```
 
Retorna 201, 400 (faltou campo), 401 (sem token), 403 (não é admin) ou 409 (ISBN repetido).
 
### GET /api/books/show (precisa de login)
 
Lista os livros que estão disponíveis. Não precisa mandar body.
 
Retorna 200 com a lista, 401 sem token ou 404 se não tiver nenhum livro disponível.
 
### POST /api/books/borrow (precisa de login)
 
Empresta um livro pro usuário logado. O prazo pra devolver é de 7 dias.
 
```json
{
  "isbn": "978-85-359-0277-5"
}
```
 
Retorna 201 com o empréstimo, 400 (sem ISBN), 401, 404 (livro não existe) ou 409 (livro já emprestado).
 
### PATCH /api/books/return (precisa de login)
 
Devolve o livro. Só quem pegou emprestado consegue devolver.
 
```json
{
  "isbn": "978-85-359-0277-5"
}
```
 
Retorna 201 se devolveu, 400, 401 ou 404 (livro não existe ou o usuário não tem esse empréstimo ativo).
 
### GET /api/books/user/borrowed (precisa de login)
 
Mostra o histórico de empréstimos do usuário logado, do mais novo pro mais antigo.
 
```json
{
  "message": "Histórico de livros",
  "data": {
    "orders": [],
    "count": 0
  }
}
```
 
### DELETE /api/books/delete (admin)
 
Apaga o livro e os empréstimos dele.
 
```json
{
  "isbn": "978-85-359-0277-5"
}
```
 
Retorna 200, 400 (sem ISBN), 401, 403 (não é admin) ou 404 (livro não existe).
 
## Transações
 
Usei transação do MongoDB (`session.withTransaction`) em três lugares:
 
- Emprestar: muda o livro pra `borrowed` e cria o registro do empréstimo. Se um falhar o outro é desfeito.
- Devolver: marca o empréstimo como devolvido e deixa o livro `available` de novo.
- Deletar: apaga os empréstimos do livro e depois apaga o livro.
## Testes
 
Os testes usam o `Deno.test` e cobrem todas as rotas, tanto os casos de sucesso quanto os de erro (sem token, sem permissão, campo faltando, etc).
 
Os arquivos ficam na pasta `tests`:
 
- `userTest.ts`: register
- `loginTest.ts`: login
- `bookTest.ts`: cadastro, listagem, empréstimo, devolução, histórico e exclusão
- `borrowTest.ts`: empréstimo e devolução
- `helpers.ts`: funções que os testes usam (login e criar livro)
Os testes fazem login com dois usuários que precisam existir no banco antes:
 
- admin@gmail.com, senha 123456 (com role admin)
- teste@gmail.com, senha 123456
Pra rodar todos:
 
```
deno test --allow-net --allow-env --allow-read --allow-ffi --env-file=.env tests/*.ts
```
 
Pra rodar só um:
 
```
deno test --allow-net --allow-env --allow-read --allow-ffi --env-file=.env tests/loginTest.ts
```
 
Os testes usam o banco do `.env`, então é melhor usar um banco de teste.
 

 
## Erros
 
Os erros são lançados com o throwlhos e tratados pelo responserror, então todos seguem o mesmo padrão do responser. Se acessar uma rota que não existe retorna 404.
 

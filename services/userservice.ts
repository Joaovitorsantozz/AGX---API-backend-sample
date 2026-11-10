
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import throwlhos from "../utils/throwlhos.ts";
import { createUser, findByEmail } from "../repository/userRepository.ts";

export async function registerUserService(
  name: string,
  email: string,
  password: string,
) {
  const findAlreadyExistingUser = await findByEmail(email);

  if (findAlreadyExistingUser)
    throw throwlhos.err_conflict("Usuário com esse email já registrado");

  const bpass = await bcrypt.hash(password, 10);

  return await createUser({ name, email, password: bpass });
}

export async function loginUserService(email: string, password: string) {
  const result = await findByEmail(email);

  const isPasswordCorrect =
    result && (await bcrypt.compare(password, result.password));

  if (!result || !isPasswordCorrect) {
    throw throwlhos.err_unauthorized(
      "Usuário não encontrado ou senha incorreta",
    );
  }
  const SECRET = Deno.env.get("JWT_SECRET");

  if (!SECRET)
    throw throwlhos.err_internalServerError("JWT SECRET não configurado");

  const payload = { userID: result.id, email: result.email, role: result.role };

  const { password: _, ...userWithoutPassword } = result.toObject();

  const token = await jwt.sign(payload, SECRET, { expiresIn: "2h" });
  return { token, user: userWithoutPassword };
}

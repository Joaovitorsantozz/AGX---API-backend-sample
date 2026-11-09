import User from "../models/usersSchema.ts";
import throwlhosModule from "throwlhos";
const throwlhos = throwlhosModule.default;

export async function registerUserService(
  name: string,
  email: string,
  password: string,
) {
  const newUser = await User.create({ name, email, password });
  return newUser;
}

export async function loginUserService(email: string) {
  try {
    const user = await User.find({ email });
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw throwlhos.err_notFound("Usuário não encontrado.");
  }
}

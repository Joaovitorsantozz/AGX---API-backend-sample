import User from "../models/usersSchema.ts";


export async function findByEmail(email: string) {
  return await User.findOne({ email });
}

export async function createUser(data: { name: string; email: string; password: string }) {
  return await User.create(data);
}


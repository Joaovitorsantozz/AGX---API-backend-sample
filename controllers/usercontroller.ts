import { Request, Response } from "express";
import bcrypt from "npm:bcrypt";
import { registerUserService } from "../services/userservice.ts";

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Missing required fields for register" });
    }
    const bpass = await bcrypt.hash(password, 10);

    const result = await registerUserService(name, email, bpass);

    if (result) {
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

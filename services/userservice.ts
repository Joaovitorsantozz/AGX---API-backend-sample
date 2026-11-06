import User from "../models/usersSchema.ts";

export async function registerUserService(name:string,email:string,password:string){ 
    const newUser= await User.create({name,email,password});
    return newUser;
}
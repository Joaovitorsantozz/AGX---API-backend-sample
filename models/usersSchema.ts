import mongose from "npm:mongoose";

const userSchema = new mongose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role: {type:String, enum: ["admin","customer"],default:"customer"},
},{timestamps:{createdAt: true, updatedAt: true}});

const User = mongose.model("User", userSchema,"users");

export default User;
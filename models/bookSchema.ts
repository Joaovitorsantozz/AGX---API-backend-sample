
import mongoose from "npm:mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  author:{type:String,required:true,trim:true},
  genre : {type:String,required:true,trim:true},
  status : {type:String,enum:["available","sold","reserved"],default : "available"},
  publishedYear:{type:Number}
});
const Books = mongoose.model("Books", bookSchema,"books");
export default Books;

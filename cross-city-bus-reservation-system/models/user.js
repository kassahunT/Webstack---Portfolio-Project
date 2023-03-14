import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    email:{
        type:String,
        required:true,
        unique:true,
        match:/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/
    },
    password:{type:String,required:true},
     role:{
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
});
export default mongoose.model('User',userSchema)
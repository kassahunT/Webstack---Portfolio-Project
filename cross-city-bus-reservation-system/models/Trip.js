import mongoose from "mongoose";
const Schema=mongoose.Schema;
const tripSchema = new Schema({
  _id:Schema.Types.ObjectId,
  source:{type:String,required:true},
  destination:{type:String,required:true},
  date:{type:String},
  time:{type:String},
  expectedArrivalTime:{type:String},
});

export default mongoose.model("Trip", tripSchema);
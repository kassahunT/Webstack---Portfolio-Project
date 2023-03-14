import  mongoose from "mongoose";
const busSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  busNumber:{type:String,required:true},
  destination:{type:String,required:false},
  plateNumber:{type:String, required:false},
  numberOfSeats:{type:Number,default:0},
  listOfAvailableSeatNumbers:{type:[]},
  seatsBooked:{type:[]},
  availableFacilities:{type:[]},
  tripId: {type: mongoose.Schema.Types.ObjectId,ref:'Trip',required: true}
});

export default mongoose.model('Bus',busSchema)
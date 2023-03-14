import mongoose from "mongoose";
const Schema=mongoose.Schema;
const bookingSchema=Schema({
    _id:mongoose.Schema.Types.ObjectId,
    price: { type: String},
    seatNumber: {type: Number,required: true },
    boardingPoints: {type: String,required: false},
    verification: {type: String,
      enum: ["verified", "not verified", "payed"],
      default: "not verified"
    },
    userId:{type: Schema.Types.ObjectId, ref: "User"},
    busId: {type: Schema.Types.ObjectId, ref: "Bus",required: true  },
    tripId:{type:Schema.Types.ObjectId,ref:"Trip",required:true},
  },{ timestamps: true }
);
export default mongoose.model('Booking',bookingSchema)
import mongoose from 'mongoose';
import Booking from '../models/booking.js';
import Bus from '../models/Bus.js';
import Trip from '../models/Trip.js';

export const bookings_get_all=(req,res,next)=>{
    Booking.find()
        .exec()
        .then(docs=>{
            res.status(200).json({
                count:docs.length,
                bookings:docs.map(doc=>{
                return{
                doc:doc,
                request:{
                    type:'GET',
                    url:'http://localhost:3003/booking/'+ doc._id
                }
                }
                })
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    }
  export const bookings_create_booking=(req,res,next)=>{
    Bus.findById(req.body.busId)
    .then(bus=>{
        if(!bus){
            return res.status(404).json({
                message:"bus not found"
            });
        }
        else {
            //check the available seat assigns conscutive seat to the passenger
       if(Number(bus.listOfAvailableSeatNumbers.length)>=1){
        if(bus.listOfAvailableSeatNumbers.includes(req.body.seatNumber)){  
        const booking=new Booking({
        _id: mongoose.Types.ObjectId(),
        price:req.body.price,
        seatNumber:req.body.seatNumber,
        boardingPoints:req.body.boardingPoints,
        verification:req.body.verification,
        busId:req.body.busId,
        tripId:req.body.tripId,
        
    });

    bus.listOfAvailableSeatNumbers= bus.listOfAvailableSeatNumbers.filter(item => item !== Number(req.body.seatNumber));//remove from available list
    
   
    const seat= Number(req.body.seatNumber);
    const booked =bus.seatsBooked;
    console.log("the seat number "+seat);
    booked.push((seat));//adding the seat to booked list
    bus.seatsBooked= bus.seatsBooked.filter(item => item !== 0);
    console.log("booked list "+booked)
    console.log("available seats"+bus.listOfAvailableSeatNumbers);
    bus.save()
    return booking.save()}else{
        res.status(404).json({
            error:"sorry!,The seat already reserved"
        })
    }}

    else{res.status(400).json({
            error:"there is no enough avalable seat"
        })}}
    })
    .then(result=>{
            res.status(201).json({
                message:"Booking stored",
                createdBooking:{
                    _id:result._id,
                    price:result.price,
                    seatNumber:result.seatNumber,
                    boardingPoints:result.boardingPoints,
                    verification:result.verification,
                    busId:result.busId,
                    tripId:result.tripId,
                },
                request:{
                    type:'GET',
                    url:'http://localhost:3003/booking/'+ result._id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
}
export const bookings_get_booking=(req,res,next)=>{
    const id= req.params.bookingId;
    Booking.findById(id)
        .exec()
        .then(booking=>{
            if(!booking){
                return res.status(404).json({
                    message:"Booking not found"
                });
            }
            res.status(200).json({
                booking:booking,
                request:{
                    type:'GET',
                    url:'http://localhost:3003/booking'
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        });
}
export const bookings_delete_booking=(req,res,next)=>{
    const id=req.params.bookingId;
    let tripStartDate,tripDate,tripTime;
    const curentTime=new Date();//ISOdate format
     Booking.findById(id)
        .exec()
        .then(booking=>{
          const Idtrip = booking.tripId.toString();//trip id 
          const Idbus=booking.busId.toString();    //bus id
            Bus.findById(Idbus)
                .exec()
                .then(bus=>{
                    const seat=Number(booking.seatNumber);
                    bus.seatsBooked= bus.seatsBooked.filter(item => item !== seat);//remove the seat from the booked list
                    bus.listOfAvailableSeatNumbers.push(seat);//adding the seat to the available seat list
                    bus.save()
                }) 
            Trip.findById(Idtrip)
            .exec()
            .then(trip=>{
               tripDate=trip.date,
               tripTime=trip.time; //time in hour
                tripStartDate=new Date(tripDate);//the date is converted to ISODate format
                const hourDiff= (tripStartDate-curentTime)/1000/60/60+tripTime; 
                console.log(hourDiff)   
                if(hourDiff>=6){    //the user can reject booking before 6 hour
                console.log("time differenc is: "+hourDiff +"hr")
                
                Booking.remove({_id:id})
                    .exec()
                    .then(result=>{
                        res.status(200).json({
                        message:"Booking deleted 6hr before trip start time",
                        request:{
                            type:'POST',
                            url:'http://localhost:3003/booking',
                            body:{busId:"ID",Price:"Number"}
                        }
                    })
                })
                }
                else{
                    return res.status(400).json({
                        message:"too let to reject the reservation"
                    });
                }
            }) 
        })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
        });
}
import mongoose from "mongoose";
import Bus from "../models/Bus.js";
import Trip from "../models/Trip.js";
import _ from "lodash"

export const addBus=(req, res)=> { // post request to registor 
      Trip.findById(req.body.tripId)
    .then(trip=>{
        if(!trip){
            return res.status(404).json({
                message:"trip not found"
            });
        }           //available buses to the route /bus
       
        const bus=new Bus({
        _id:new mongoose.Types.ObjectId(),
        tripId:req.body.tripId,
        busNumber:req.body.busNumber,
        destination:req.body.destination,
        plateNumber:req.body.plateNumber,
        numberOfSeats:req.body.numberOfSeats,
        listOfAvailableSeatNumbers:_.range(1,Number(req.body.numberOfSeats)+1),// if bus have 10 seats it will be[1,2,...,10]
        seatsBooked: req.body.seatsBooked,
        availableFacilities:req.body.availableFacilities
        });
        return bus.save();
        })
        .then(result=>{
            res.status(201).json({
                message:"Trip stored",
                createdTrip:result,
                request:{
                    type:'POST',
                    url:'http://localhost:3003/bus/'+ result._id
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
export const getBuses =(req, res) =>{
 Bus.find()
    .exec()
    .then(docs=>{
        res.status(200).json({
                count:docs.length,
                buses:docs.map(doc=>{
                    return{
                        _id:doc._id,
                        busNumber:doc.busNumber,
                        destination:doc.destination,
                        plateNumber:doc.plateNumber,
                        numberOfSeats:doc.numberOfSeats,
                        listOfAvailableSeatNumbers:doc.listOfAvailableSeatNumbers.sort(),// if bus have 10 seats it will be[1,2,...,10]
                        seatsBooked: doc.seatsBooked.sort(),
                        availableFacilities:doc.availableFacilities,
                        tripId:doc.tripId,
                        request:{
                            type:'GET',
                            url:'http://localhost:3003/bus/'+ doc._id
                        }
                    }
                })
            })
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}
export const getBusById=(req, res, next)=> {
  const Id=req.params.busId;
  console.log(Id);
    Bus.findById(Id)
            .exec()
            .then(doc=>{
        console.log(doc);
          if(doc){
              res.status(200).json(doc);
          }
          else{
              res.status(404).json({message:"No valid entry found for the bus ID"})
          }
    }).catch(err=>{
      console.log(err)
        res.status(500).json({error:err});
    });
}
export const getBusBookedById=(req, res, next)=> {
  const Id=req.params.busId;
  console.log(Id);
    Bus.findById(Id)
            .exec()
            .then(doc=>{
        console.log(doc);
          if(doc){
              res.status(200).json({
                reserved:doc.seatsBooked.sort(),
                available:doc.listOfAvailableSeatNumbers,
                bus:Id,
                trip:doc.tripId
              });
          }
          else{
              res.status(404).json({message:"No valid entry found for the bus ID"})
          }
    }).catch(err=>{
      console.log(err)
        res.status(500).json({error:err});
    });
}
export const deleteBus=(req,res,next)=>{
    const id=req.params.busId;
            Bus.remove({_id:id})
                .exec()
                .then(result=>{
                        res.status(200).json({
                        message:"Bus deleted ",
                        request:{
                            type:'POST',
                            url:'http://localhost:3003/bus',
                            body:{busId:"ID",busNumber:"string"}
                        }
                    })
                })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
        });
}
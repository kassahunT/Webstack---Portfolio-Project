import Trip from "../models/Trip.js";
import mongoose from "mongoose";

 export const addTrip=(req,res,next)=>{
          const trip=new Trip({
        _id: mongoose.Types.ObjectId(),
        source:req.body.source,
        destination:req.body.destination,
        date:req.body.date,
        time:req.body.time,
        expectedArrivalTime:req.body.expectedArrivalTime
         });
        trip.save()
          .then(result=>{
            console.log(result);
            res.status(201).json({
                message:"Trip stored",
                createdTrip:result,
                request:{
                    type:'POST',
                    url:'http://localhost:3003/trip/'+ result._id
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

export const getTrip= (req, res)=> {
    Trip.findById(req.params.tripId)
    .exec()
    .then(trip=>{
        res.status(200).json({
            trip:trip,
            request:{
                type:'GET',
                url:'http://localhost:3003/trip'
            }
        })
        
    }).catch(err=>{
            res.status(500).json({
                error:err
            });
        });
}
export const getTrips =(req, res) =>{
 Trip.find()
    .exec()
    .then(docs=>{
        res.status(200).json({
                count:docs.length,
                trips:docs.map(result=>{
                    return{
                        _id:result._id,
                        source:result.source,
                        destination:result.destination,
                        date:result.date,
                        time:result.time,
                        expectedArrivalTime:result.expectedArrivalTime,
                        request:{
                            type:'GET',
                            url:'http://localhost:3003/trip/'+ result._id
                        }
                    }
                })
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        });

}
export const trips_delete_trip=(req,res,next)=>{
    const id=req.params.tripId;
            Trip.remove({_id:id})
                .exec()
                .then(result=>{
                        res.status(200).json({
                        message:"Trip deleted ",
                        request:{
                            type:'POST',
                            url:'http://localhost:3003/trip',
                            body:{source:"string",destination:"string"}
                        }
                    })
                })
         .catch(err=>{
            res.status(500).json({
                error:err
            })
        });
}
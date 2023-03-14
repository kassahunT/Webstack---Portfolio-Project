import express from "express";
import morgan from 'morgan';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

import bookingsRoutes from './routes/booking.js';
import userRoutes from './routes/user.js'
import tripRoutes from './routes/trip.js'
import busRoutes from './routes/bus.js';

mongoose.connect('mongodb+srv://kassahun:'+ process.env.MONGo_ATLAS_PW +'@cluster0.fqkofdq.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: true    
}
)

const app=express();
var options = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:"Cross-city node js API project for mongoDb",
            version:'1.0.0'
        },
        servers:[
            {
                url: 'http://localhost:3003/'
            }
        ]
    },
    apis:['./app.js']
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * @swagger
 * components:
 *      schema:
 *         Trip:
 *              type: object
 *              properties:
 *                      _id:
 *                       type: string
 *                      source:
 *                          type: string
 *                      destination:
 *                          type: string
 *                      date:
 *                          type: string
 *                      time:
 *                          type: string
 *                      expectedArrivalTime:
 *                          type: string
 */
/**
 * @swagger
 * /trip:
 *  get:
 *      summary: This is Trip get request
 *      description: Trip get method
 *      response:
 *          200:
 *              description: ok for the get method 
 *              content: 
 *                      application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#components/schema/Trip'
 *  
 */
app.use('/trip',tripRoutes)
/**
 * @swagger
 * /bus:
 *  get:
 *      summary: This is Bus get request
 *      description: Bus get method
 *      response:
 *          200:
 *              description: ok for the get method 
 *  
 */
app.use('/bus',busRoutes)
/**
 * @swagger
 * /booking:
 *  get:
 *      summary: This is Booking get request
 *      description: Booking get method
 *      response:
 *          200:
 *              description: ok for the get method 
 *  
 */
app.use('/booking',bookingsRoutes);
/**
 * @swagger
 * /user:
 *  get:
 *      summary: This is User get request
 *      description: User get method
 *      response:
 *          200:
 *              description: ok for the get method 
 *  
 */
app.use('/user',userRoutes)


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type,Accept,Authorization"
    );
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})
app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status ||500);
    res.json({
        error:{
            message:error.message
        }
    });
});
export default app;
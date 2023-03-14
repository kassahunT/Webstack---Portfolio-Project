import jwt from "jsonwebtoken";

const checkAuth= (permissions)=>{
return (req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        req.userData=decoded;
        if(permissions.includes(req.userData.role)){
         next(); 
         }else{
           res.status(403).json({message:"permission denied "})
         }
    }catch(error){
        return res.status(401).json({
            message:'Auth failed'
        });
    }}
};
export default checkAuth;
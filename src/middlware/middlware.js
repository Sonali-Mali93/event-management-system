const jwt=require("jsonwebtoken")
// const bookModel = require("../models/booksModel")
const eventModel = require("../models/eventModel")
const mongoose = require("mongoose")

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const authentication=(req,res,next)=>{
    try{
    let token=req.headers["x-api-token"]
    if(!token)
    return res.status(400).send({status:false,msg:"please enter token"})

    let decodeToken=jwt.verify(token,"group05")
    
    if(!decodeToken)
    return res.status(401).send({status:false,msg:"token is invalid please enter valid token"})

    req['userId']= decodeToken.userId

    next()
    }
    catch(err){
    return res.status(500).send({status:false,msg:err.message})
    }
   

    

    
}

const authorization=async (req,res,next)=>{
    try{ 
        const id = req.userId
        const eventId = req.params.eventId
        if (!eventId) {
            return res.status(400).send({ status: false, msg: "please provide eventId" })
        }
        if (!isValidobjectId(eventId)) {
            return res.status(400).send({ status: false, msg: "please provide valid eventId" })
        }

        const event = await eventModel.findOne({_id : eventId,isDeleted: false})
        if(!event){
            return res.status(400).send({status:false,msg:"No such Event Exists"})
        }

        const user = event.userId.toString()
       
        if(user !== id ){
            return res.status(403).send({status:false,msg:"User Is Not Authorized to Edit"})
        }

        next()

    }catch(err){
        return res.status(500).status({status:false,msg:err.message})
    }
}

module.exports.authentication=authentication
module.exports.authorization=authorization




















// const authorization=(req,res,next)=>{
//     try{






//     }catch(err){
//         return res.status(500).status({status:false,msg:err.message})
//     }
// }
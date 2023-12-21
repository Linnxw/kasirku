import {Request,Response} from "express"
import db from "../config/Database";
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
import {IDecodeUser,IUser,IRequestUser} from "../types"
export const getProducts = (req:Request,res:Response)=>{
  db.query("SELECT * FROM products",(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return res.status(500).json({status:false,msg:err.message})
    }
    response(res,200,"succes get products",data)
  })
 
}

export const addProduct =async (req:IRequestUser,res:Response)=>{
  res.json({data:""})
}
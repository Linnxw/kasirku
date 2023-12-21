import {Request,Response} from "express"
import db from "../config/Database"
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
export const getCategorys = (req:Request,res:Response)=>{
  const query = "SELECT * FROM categorys"
  db.query(query,(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    
    response(res,200,"get categorys",data)
  })
}

export const addCategory = (req:Request,res:Response)=>{
  const query = "INSERT INTO categorys (`categoryName`) VALUES (?)"
  
  db.query(query,[req.body.categoryName],(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    console.log(data)
    response(res,200,"succes add category"," ")
  })
}
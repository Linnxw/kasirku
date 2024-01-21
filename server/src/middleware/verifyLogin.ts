import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
import {IDecodeUser,IUser,IRequestUser} from "../types"
export const verifyLogin = (req:IRequestUser,res:Response,next:NextFunction) =>{
  const accesToken: string | undefined = req.headers?.authorization?.split(" ")[1]
  const secret = process.env.ACCES_TOKEN_SECRET!
  if(!accesToken){
    return responseErr(res,401,"Autentication is required")
  }
  jwt.verify(accesToken,secret,(err:any,decode:any)=>{
    if(err){
      return responseErr(res,403,"Invalid token")
    }
    req.user = decode.user
    next()
  })
}
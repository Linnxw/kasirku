import {Request,Response} from "express"
import db from "../config/Database";
import {logger} from "../config/pino"
import passwordHash from "password-hash"
import {response,responseErr} from "../helper/response"
import jwt from "jsonwebtoken"
import {IUser} from "../types"
export const register = (req:Request,res:Response)=>{
  const {userName,password} = req.body
  const searchUsername = "SELECT * FROM users WHERE userName = ?"
  db.query(searchUsername,[userName],(err:any,data:IUser[])=>{
    if(err){
      logger.err(err)
      return responseErr(res,500,err.message)
    }
    if(data[0]){
      return responseErr(res,400,"Username is registered")
    }
  })
  
  const hash = passwordHash.generate(password)
  const addUser = "INSERT INTO users (`userName`,`password`,`level`) VALUES(?,?,?)"
  db.query(addUser,[userName,hash,2],(err:any,data:any)=>{
    if(err){
      logger.err(err)
      return responseErr(res,500,err.message)
    }
    response(res,200,"Register succesfully"," ")
  })
}

export const login = (req:Request,res:Response)=>{
  const {userName,password} = req.body
  if(req.cookies.auth)
  return res.status(409).json({msg:"Your is logined"})
  const searchUsername = "SELECT * FROM users WHERE userName = ?"
  db.query(searchUsername,[userName],(err:any,data:IUser[])=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    if(!data[0]){
      return responseErr(res,400,"Username not registered")
    }
    const match: boolean = passwordHash.verify(password,data[0].password!)
    if(!match){
      return responseErr(res,400,"password not match")
    }
    const user:IUser = data[0]
    delete user.password
    const accesToken: string= jwt.sign({user},process.env.ACCES_TOKEN_SECRET!,{
      expiresIn:"7d"
    })
  
    res.status(200).json({msg:"Login successFully",user,accesToken})
  })
}

export const logout = (req:Request,res:Response)=>{
  res.clearCookie("token").status(200).json({msg:"logout succesfully"})
}
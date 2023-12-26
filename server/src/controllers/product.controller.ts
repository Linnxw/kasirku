import {Request,Response} from "express"
import db from "../config/Database";
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
import path from "path"
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
  const {
    productName,
    price,
    qty,
    categoryId
  } = req.body
  if(!productName || !price || !qty)
  return res.status(400).json({msg:'invalid payload'})

  const file:any = req?.files?.image
  const randomNumber = Math.round(new Date().getTime() / Math.random())
  const extension = path.extname(file.name)
  const fileName = randomNumber + extension
  const fileSize = file["size"]
  const ALLOW_FILE_EXTENSION = [".jpg",".png",".jpeg",".webp"]
  const MAX_FILE_SIZE = 5000000
  
  if(fileSize > MAX_FILE_SIZE)
  return responseErr(res,500,"File size should not be more than 5mb")
  if(!ALLOW_FILE_EXTENSION.includes(extension.toLowerCase()))
  return responseErr(res,400,"file type is not allowed")

  file.mv(path.join("./public/product/"+fileName),(err:any)=>{
    if(err){
      console.log(err)
      return responseErr(res,400,err)
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/product/${fileName}`
    const q = "INSERT INTO products(`productName`,`price`,`qty`,`categoryId`,`image`,`urlImage`,`userId`) VALUES(?,?,?,?,?,?,?)"
    const values = [
      productName,
      price,
      qty,
      categoryId,
      fileName,
      imageUrl,
      req.user?.userId
      ]
    db.query(q,values,(err:any,data:any)=>{
      if(err){
        console.log(err)
        return responseErr(res,500,err.message)
      }
    })
  })
  response(res,200,"succes add",null)
}
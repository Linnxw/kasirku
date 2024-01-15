import {Request,Response} from "express"
import db from "../config/Database";
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
import {fileValidate} from "../helper/validation/file.validation"
import path from "path"
import {unlinkSync} from "fs"
import {IDecodeUser,IUser,IRequestUser} from "../types"

export const getTransactions = (req:Request,res:Response)=>{
  db.query("SELECT * FROM riwayat",(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return res.status(500).json({status:false,msg:err.message})
    }
    response(res,200,"succes get transactions",data)
  })
 
}

export const addShelling = (req:Request,res:Response) =>{
  const STATUS = "OUT"
  const { 
    date,
    qty,
    casir,
    cash,
  } = req.body
  const {id} = req.params
  
  if(!qty || qty < 1)
  return responseErr(res,400,"qty not valid")
  if(!id)
  return responseErr(res,400,"id required")
  
  
  db.query("SELECT * FROM products as p JOIN categorys as c ON(c.categoryId = p.categoryId) WHERE productId = ?",[id],(err:any,data:any)=>{
    if(err){
        console.log(err)
        return responseErr(res,500,err.message)
    }
    if(!data.length)
    return responseErr(res,404,"Product not found")
    const dataProduct = data[0]
    
    if(cash < dataProduct.price * qty){
    return responseErr(res,400,"Cash not enought")
  }
 
 let change: number = cash - (dataProduct.price * qty)

  db.beginTransaction((err)=>{
   if(err){
        console.log(err)
        return responseErr(res,500,err.message)
    }
    const qProduct = "UPDATE products SET qty = qty - ? WHERE productId = ?"
    db.query(qProduct,[qty,req.params.id],(err:any,data:any)=>{
      if(err){
        console.log(err)
        db.rollback(()=>{
          return responseErr(res,500,err.message)
        })
      }
    })
    
    const qRiwayat = "INSERT INTO riwayat(`productName`,`status`,`date`,`qty`,`urlimage`,`categoryName`,`casirName`,`cash`,`change`,`price`) VALUES(?,?,?,?,?,?,?,?,?,?)"
    
    db.query(qRiwayat,[dataProduct.productName,
    STATUS,
    date,
    qty,
    dataProduct.urlImage,
    dataProduct.categoryName,
    casir,
    cash,
    change,
    dataProduct.price],(err:any,data:any)=>{
    if(err){
        console.log(err)
        db.rollback(()=>{
          return responseErr(res,500,err.message)
        })
      }
      db.commit()
      response(res,200,"Succes add transation",{change : change})
    })
  })
  })
}

export const addBuying = (req:Request,res:Response) =>{
  const STATUS = "IN"
  const { 
    date,
    qty,
    casir,
    cash,
  } = req.body
  const {id} = req.params
  
  if(!qty || qty < 1)
  return responseErr(res,400,"qty not valid")
  if(!id)
  return responseErr(res,400,"id required")
  
  
  db.query("SELECT * FROM products as p JOIN categorys as c ON(c.categoryId = p.categoryId) WHERE productId = ?",[id],(err:any,data:any)=>{
    if(err){
        console.log(err)
        return responseErr(res,500,err.message)
    }
    if(!data.length)
    return responseErr(res,404,"Product not found")
    const dataProduct = data[0]
    
    if(cash < dataProduct.price * qty){
    return responseErr(res,400,"Cash not enought")
  }
 
 let change: number = cash - (dataProduct.price * qty)

  db.beginTransaction((err)=>{
   if(err){
        console.log(err)
        return responseErr(res,500,err.message)
    }
    const qProduct = "UPDATE products SET qty = qty + ? WHERE productId = ?"
    db.query(qProduct,[qty,req.params.id],(err:any,data:any)=>{
      if(err){
        console.log(err)
        db.rollback(()=>{
          return responseErr(res,500,err.message)
        })
      }
    })
    
    const qRiwayat = "INSERT INTO riwayat(`productName`,`status`,`date`,`qty`,`urlimage`,`categoryName`,`casirName`,`cash`,`change`,`price`) VALUES(?,?,?,?,?,?,?,?,?,?)"
    
    db.query(qRiwayat,[dataProduct.productName,
    STATUS,
    date,
    qty,
    dataProduct.urlImage,
    dataProduct.categoryName,
    casir,
    cash,
    change,
    dataProduct.price],(err:any,data:any)=>{
    if(err){
        console.log(err)
        db.rollback(()=>{
          return responseErr(res,500,err.message)
        })
      }
      db.commit()
      response(res,200,"Succes add transation",{change : change})
    })
  })
  })

}

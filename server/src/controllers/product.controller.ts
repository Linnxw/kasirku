import {Request,Response} from "express"
import db from "../config/Database";
import {logger} from "../config/pino"
import {response,responseErr} from "../helper/response"
import {fileValidate} from "../helper/validation/file.validation"
import path from "path"
import {unlinkSync} from "fs"
import {IDecodeUser,IUser,IRequestUser} from "../types"
export const getProducts = (req:Request,res:Response)=>{
  db.query("SELECT * FROM products as p JOIN categorys as c ON(c.categoryId = p.categoryId)",(err:any,data:any)=>{
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
  
  const fileName = fileValidate(res,file)

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
    db.beginTransaction((err:any)=>{
      if(err){
        console.log(err)
        return responseErr(res,500,err)
      }

      db.query("UPDATE categorys SET productCount = productCount + 1 WHERE categoryId = ?",categoryId,(err:any,data:any)=>{
      if(err){
        console.log(err)
        db.rollback()
        return responseErr(res,500,err.message)
      }
      })
      
      db.query(q,values,(err:any,data:any)=>{
      if(err){
        console.log(err)
        db.rollback()
        return responseErr(res,500,err.message)
      }
    })
    })
  })
  response(res,200,"succes add",null)
}

export const getProductById = (req:Request,res:Response) =>{
  const {id} = req.params
  if(!id)
  return res.sendStatus(400)
  const q = "SELECT * FROM products AS p JOIN categorys AS c ON(c.categoryId = p.categoryId) WHERE productId = ?"
  db.query(q,[id],(err:any,data:any)=>{
    if(err){
        console.log(err)
        return responseErr(res,500,err.message)
    }
    if(!data[0])
    return responseErr(res,404,"Can't find product")
    response(res,200,"Succes get a product",data[0])
  })
}

export const editProduct = (req:Request,res:Response) =>{
  const {id} = req.params
  const {
    productName,
    price,
    qty,
    categoryId
  } = req.body
  if(!productName || !price || !qty)
  return res.status(400).json({msg:'invalid payload'})
  
  if(req.files?.image){
    const file:any = req.files?.image
    const fileName = fileValidate(res,file)
    
    file.mv(path.join("./public/product/"+fileName),(err:any)=>{
    if(err){
      console.log(err)
      return responseErr(res,400,err)
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/product/${fileName}`
    
    db.query("SELECT image FROM products WHERE productId = ?",[id],(err:any,data)=>{
      if(err){
        console.log(err)
        return responseErr(res,500,err.message)
      }
      const {image} = data[0]
      if(!image)
      return responseErr(res,404,"Image not set in this product")
      unlinkSync(`./public/product/${image}`)
    })
    
    const q = "UPDATE products SET productName = ?,price = ? ,qty = ?,categoryId = ?,image = ?,urlImage = ? WHERE productId = ?"
    const values = [
      productName,
      price,
      qty,
      categoryId,
      fileName,
      imageUrl,
      id
      ]
    db.query(q,values,(err:any,data:any)=>{
      if(err){
        console.log(err)
        return responseErr(res,500,err.message)
      }
    })
  })
  }else{
    const q = "UPDATE products SET productName = ?,price = ? ,qty = ?,categoryId = ? WHERE productId = ?"
    const values = [
      productName,
      price,
      qty,
      categoryId,
      id
      ]
    db.query(q,values,(err:any,data:any)=>{
      if(err){
        console.log(err)
        return responseErr(res,500,err.message)
      }
    })
  }
  response(res,200,"Succes edit product",null)
}

export const addStockProduct = (req:Request,res:Response) =>{
  const {qty} = req.query
  
  const q = "UPDATE products SET qty = qty + ? WHERE productId = ?"
  db.query(q,[qty,req.params.id],(err:any,data:any)=>{
    if(err){
        console.log(err)
        return responseErr(res,500,err.message)
      }
      response(res,200,"Succes add stock product",null)
  })
}


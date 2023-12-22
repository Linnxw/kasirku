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

export const getCategory = (req:Request,res:Response)=>{
  const query = "SELECT * FROM categorys WHERE categoryId = ?"
  db.query(query,req.params.id,(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    
    response(res,200,"get categorys",data[0])
  })
}


export const addCategory = (req:Request,res:Response)=>{
  const query = "INSERT INTO categorys (`categoryName`) VALUES (?)"
  
  db.query(query,[req.body.categoryName],(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    response(res,200,"succes add category"," ")
  })
}

export const editCategory = async (req:Request,res:Response) =>{
  const q = "UPDATE categorys SET categoryName = ? WHERE categoryId = ?"
  db.query(q,[req.body.categoryName,req.params.id],(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
    response(res,200,"succes edit category"," ")
  })
}

export const deleteCategory = (req:Request,res:Response)=>{
  const q = "DELETE FROM categorys WHERE categoryId = ?"
  db.query(q,[req.params.id],(err:any,data:any)=>{
    if(err){
      logger.error(err)
      return responseErr(res,500,err.message)
    }
  
    response(res,200,"succes delete category"," ")
  })
}
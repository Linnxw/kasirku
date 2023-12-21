import {Response} from "express"
export const responseErr = (res:Response,code:number,msg:string)=> {
  res.status(code).json({
    status:false,
    statusCode:code,
    msg
  })
}
export const response = (res:Response,code:number,msg:string,data:any)=> {
  res.status(code).json({
    status:true,
    statusCode:code,
    msg,
    result:data
  })
}
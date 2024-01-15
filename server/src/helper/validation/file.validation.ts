import {Response} from "express"
import {response,responseErr} from "../response"
import path from "path"
export const fileValidate = (res:Response,file:any) =>{
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
  return fileName
}
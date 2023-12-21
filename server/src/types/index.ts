import {Request} from "express"
export interface IUser {
  userId:number 
  userName:string
  password?:string
  level:number
}

export interface IDecodeUser{
  user:IUser
  iat:number
  exp:number
}

export interface IRequestUser extends Request{
  user?:{
    userId?:number 
    userName?:string
    level?:number
  }
}
import express,{Application} from "express"
import {logger} from "./config/pino"
import cors from "cors"
import userRouter from "./routes/user.router"
import productRouter from "./routes/product.route"
import categoryRouter from "./routes/category.router"
import db from "./config/Database"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()

const app: Application = express()

const corsOptions = {
  credentials:true,
  origin:"http://localhost:5173"
}

app.use(express.json())
app.use(express.static("public"))
app.use(cors(corsOptions))
app.use(cookieParser())

app.use(userRouter)
app.use(productRouter)
app.use(categoryRouter
)
app.listen(process.env.PORT || 6060,()=>{
  logger.info("server runing")
})
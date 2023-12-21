import express,{Router} from "express"
import {register,login,logout} from "../controllers/user.controller"
const router: Router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.delete("/logout",logout)

export default router
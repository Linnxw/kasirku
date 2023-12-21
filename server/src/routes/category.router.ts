import express,{Router} from "express"
import {addCategory,getCategorys} from "../controllers/category.controller"
const router: Router = express.Router()

router.post("/category",addCategory)
router.get("/categorys",getCategorys)

export default router
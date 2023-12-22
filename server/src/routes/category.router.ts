import express,{Router} from "express"
import {addCategory,getCategorys,editCategory,deleteCategory,getCategory} from "../controllers/category.controller"
const router: Router = express.Router()

router.post("/category",addCategory)
router.get("/categorys",getCategorys)
router.get("/category/:id",getCategory)
router.patch("/category/:id",editCategory)
router.delete("/category/:id",deleteCategory)

export default router
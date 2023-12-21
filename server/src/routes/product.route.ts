import {Router} from "express"
import {getProducts,addProduct} from "../controllers/product.controller"
import {verifyLogin} from "../middleware/verifyLogin"
const router: Router = Router()

router.get("/products",getProducts)
router.post("/product",verifyLogin,addProduct)
export default router
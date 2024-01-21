import {Router} from "express"
import {getProducts,addProduct,getProductById,editProduct,addStockProduct} from "../controllers/product.controller"
import {verifyLogin} from "../middleware/verifyLogin"
const router: Router = Router()

router.get("/products",getProducts)
router.get("/product/:id",getProductById)
router.use(verifyLogin)
router.post("/product",addProduct)
router.patch("/product/:id",editProduct)
router.post("/product/stock/:id",addStockProduct)

export default router
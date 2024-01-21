import {Router} from "express"
import {getTransactions,addShelling,addBuying} from "../controllers/transaction.controller"
import {verifyLogin} from "../middleware/verifyLogin"
const router: Router = Router()

router.use(verifyLogin)
router.get("/transactions",getTransactions)
router.post("/transaction/out/:id",addShelling)
router.post("/transaction/in/:id",addBuying)


export default router
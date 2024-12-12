import express from 'express';
import { updateOrder } from '../controller/orderController.js';
import protectRoute from '../middleware/protectRoute.js';
import { getFilteredRows, getOrderItems } from '../controller/readSheetController.js';
const router = express.Router();
router.post("/update-spreadsheet",protectRoute, updateOrder);
router.get("/get-filtered-order/:contact",protectRoute, getFilteredRows);
router.get("/get-order-items",protectRoute, getOrderItems);
export default router;
import express from "express";
import { createVillage, getAllVillages, createStock, getStock, createItemStock, getStockItems, getStocks, updateStockItem, } from "../controllers/VillageControllers.js";
import checkAuth from "../utils/checkAuth.js";
const router = express.Router();
router.post("/create", checkAuth, createVillage);
router.get("/getAll", checkAuth, getAllVillages);
router.post("/createStock/:id", checkAuth, createStock);
router.get("/getStock/:id", checkAuth, getStock);
router.get("/getStocks/:id", checkAuth, getStocks);
router.post("/createStockItem/:id", checkAuth, createItemStock);
router.post("/getStockItems", checkAuth, getStockItems);
router.patch("/updateStockItem/:id/:stockItemId", checkAuth, updateStockItem);
export default router;
//# sourceMappingURL=village.js.map
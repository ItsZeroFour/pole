import express from "express";
import { createVillage, getAllVillages, createStock, getStock, createItemStock, getStockItems, getStocks, updateStockItem, getStockItem, moveStockItem, createShipment, getShipmentHistory, } from "../controllers/VillageControllers.js";
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
router.get("/getStockItem/:id", checkAuth, getStockItem);
router.patch("/moveItem/:id", checkAuth, moveStockItem);
router.post("/createShipment", checkAuth, createShipment);
router.get("/getShipment/:id", checkAuth, getShipmentHistory);
export default router;
//# sourceMappingURL=village.js.map
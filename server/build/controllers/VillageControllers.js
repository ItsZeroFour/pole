import Village from "../models/Village.js";
import Stock from "../models/Stock.js";
import { WheatStock, PeasStock, SunflowerStock, NoneStock, ItemStock, } from "../models/ItemStock.js";
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Create village
 **/
export const createVillage = async (req, res) => {
    try {
        const doc = new Village({
            name: req.body.name,
        });
        const village = await doc.save();
        res.status(200).json(village);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать село",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get all vilages
 **/
export const getAllVillages = async (req, res) => {
    try {
        const villages = await Village.find();
        res.status(200).json(villages);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить села",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Create stock for village
 **/
export const createStock = async (req, res) => {
    try {
        const villageId = req.params.id;
        const { name } = req.body;
        if (!name) {
            res.status(401).json({
                message: "Заполните все поля!",
            });
            return;
        }
        const newStock = new Stock({ name });
        await newStock.save();
        try {
            await Village.findByIdAndUpdate(villageId, {
                $push: {
                    stocks: newStock._id,
                },
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Не удалось загрузить склад",
            });
            return;
        }
        res.json(newStock);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать склад",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get village's stock
 **/
export const getStock = async (req, res) => {
    try {
        const stockId = req.params.id;
        const stock = await Stock.findById(stockId);
        res.status(200).json(stock);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить информацию и складе",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get village's stocks
 **/
export const getStocks = async (req, res) => {
    try {
        const villageId = req.params.id;
        const village = await Village.findById(villageId);
        if (!village) {
            res.status(404).json({
                message: "Населенный пункт не найден",
            });
            return;
        }
        const stocksItems = await Promise.all(village.stocks.map(async (itemId) => {
            return await Stock.findById(itemId).exec();
        }));
        res.status(200).json(stocksItems);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить информацию и складе",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Create stock's item
 **/
export const createItemStock = async (req, res) => {
    const { itemType, ...params } = req.body;
    const stockId = req.params.id;
    try {
        let stock;
        switch (itemType) {
            case "Wheat":
                stock = new WheatStock(params);
                break;
            case "Peas":
                stock = new PeasStock(params);
                break;
            case "Sunflower":
                stock = new SunflowerStock(params);
                break;
            case "None":
                stock = new NoneStock(params);
                break;
            default:
                res.status(404).json({
                    message: "Не удалось создать ячейку",
                });
                return;
        }
        await stock.save();
        try {
            await Stock.findByIdAndUpdate(stockId, {
                $push: {
                    items: stock._id,
                },
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Не удалось загрузить склад",
            });
            return;
        }
        res.status(201).json(stock);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать элемент для склада",
        });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Update stock's item
 **/
export const updateStockItem = async (req, res) => {
    const { itemType, ...params } = req.body;
    const { id: stockId, stockItemId } = req.params;
    try {
        // Найдите текущий элемент по ID
        const currentStockItem = await ItemStock.findById(stockItemId);
        if (!currentStockItem) {
            res.status(404).json({ message: "Элемент не найден" });
            return;
        }
        // Удалите текущий элемент
        await ItemStock.findByIdAndDelete(stockItemId);
        // Создайте новый элемент с обновленным itemType
        let newStockItem;
        switch (itemType) {
            case "Wheat":
                newStockItem = new WheatStock(params);
                break;
            case "Peas":
                newStockItem = new PeasStock(params);
                break;
            case "Sunflower":
                newStockItem = new SunflowerStock(params);
                break;
            case "None":
                newStockItem = new NoneStock(params);
                break;
            default:
                res.status(400).json({ message: "Неверный тип элемента" });
                return;
        }
        // Сохраните новый элемент
        await newStockItem.save();
        // Обновите ссылку в основном складе
        await Stock.findByIdAndUpdate(stockId, {
            $set: {
                items: newStockItem._id,
            },
        });
        res.status(200).json(newStockItem);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка обновления элемента" });
    }
};
/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get stock's items
 **/
export const getStockItems = async (req, res) => {
    try {
        const stockIds = req.body.ids; // Изменим на массив id складов
        const stocks = await Stock.find({ _id: { $in: stockIds } });
        if (!stocks.length) {
            res.status(404).json({
                message: "Склады не найдены",
            });
            return;
        }
        const enrichedStocks = await Promise.all(stocks.map(async (stock) => {
            const stockItems = await Promise.all(stock.items.map(async (itemId) => {
                const wheatItem = await WheatStock.findById(itemId).exec();
                if (wheatItem)
                    return wheatItem;
                const peasItem = await PeasStock.findById(itemId).exec();
                if (peasItem)
                    return peasItem;
                const sunflowerItem = await SunflowerStock.findById(itemId).exec();
                if (sunflowerItem)
                    return sunflowerItem;
                const noneItem = await NoneStock.findById(itemId).exec();
                if (noneItem)
                    return noneItem;
                return null;
            }));
            return {
                ...stock.toObject(), // Конвертируем документ MongoDB в обычный объект
                items: stockItems.filter((item) => item !== null), // Заменяем items на полные данные элементов
            };
        }));
        res.status(200).json(enrichedStocks);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить элементы складов",
        });
    }
};
//# sourceMappingURL=VillageControllers.js.map
import { Request, Response } from "express";
import Village from "../models/Village.js";
import Stock from "../models/Stock.js";
import {
  WheatStock,
  PeasStock,
  SunflowerStock,
  NoneStock,
  ItemStock,
} from "../models/ItemStock.js";
import ShipmentHistory from "../models/ShipmentHistory.js";

/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Create village
 **/

export const createVillage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doc = new Village({
      name: req.body.name,
    });

    const village = await doc.save();

    res.status(200).json(village);
  } catch (err) {
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
export const getAllVillages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const villages = await Village.find();

    res.status(200).json(villages);
  } catch (err) {
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
export const createStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const villageId: string = req.params.id;
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
      await Village.findByIdAndUpdate(
        villageId,
        {
          $push: {
            stocks: newStock._id,
          },
        },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось загрузить склад",
      });
      return;
    }

    res.json(newStock);
  } catch (err) {
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
export const getStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const stockId: string = req.params.id;

    const stock = await Stock.findById(stockId);

    res.status(200).json(stock);
  } catch (err) {
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
export const getStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const villageId: string = req.params.id;
    const village = await Village.findById(villageId);

    if (!village) {
      res.status(404).json({
        message: "Населенный пункт не найден",
      });
      return;
    }

    const stocksItems = await Promise.all(
      village.stocks.map(async (itemId) => {
        return await Stock.findById(itemId).exec();
      })
    );

    res.status(200).json(stocksItems);
  } catch (err) {
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
export const createItemStock = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      await Stock.findByIdAndUpdate(
        stockId,
        {
          $push: {
            items: stock._id,
          },
        },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось загрузить склад",
      });

      return;
    }

    res.status(201).json(stock);
  } catch (err) {
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
export const updateStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    // Обновите ссылку на элемент в массиве items основного склада
    await Stock.findOneAndUpdate(
      { _id: stockId, items: stockItemId },
      { $set: { "items.$": newStockItem._id } }
    );

    res.status(200).json(newStockItem);
  } catch (err) {
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
export const getStockItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stockIds: string[] = req.body.ids;
    const stocks = await Stock.find({ _id: { $in: stockIds } }).exec();

    if (!stocks.length) {
      res.status(404).json({
        message: "Склады не найдены",
      });
      return;
    }

    const enrichedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const stockItems = await Promise.all(
          stock.items.map(async (item) => {
            let foundItem = await WheatStock.findById(item._id).exec();
            if (foundItem) return foundItem;

            foundItem = await PeasStock.findById(item._id).exec();
            if (foundItem) return foundItem;

            foundItem = await SunflowerStock.findById(item._id).exec();
            if (foundItem) return foundItem;

            foundItem = await NoneStock.findById(item._id).exec();
            if (foundItem) return foundItem;

            return null;
          })
        );

        return {
          ...stock.toObject(), // Конвертируем документ MongoDB в обычный объект
          items: stockItems.filter((item) => item !== null), // Заменяем items на полные данные элементов
        };
      })
    );

    // Сортируем items в каждом stock по id
    enrichedStocks.forEach((stock) => {
      stock.items.sort((a, b) => a.id - b.id);
    });

    res.status(200).json(enrichedStocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить элементы складов",
    });
  }
};

/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get stock item
 **/
export const getStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stockItemId = req.params.id;

    const stockItem = await ItemStock.findById(stockItemId);

    if (!stockItem) {
      res.status(404).json({
        message: "Ячейка не найдена",
      });

      return;
    }

    res.status(200).json(stockItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось поулчить ячейку",
    });
  }
};

/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Move stock item to another stock
 **/
export const moveStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentStockItemId = req.params.id;
    const { currentStockId, newStockItemId, newStockId, itemCount, ...params } =
      req.body;

    const stockItem = await ItemStock.findById(currentStockItemId);
    const newStockItem = await ItemStock.findById(newStockItemId);

    if (!stockItem || !newStockItem) {
      res.status(404).json({
        message: "Не удалось найти элемент",
      });
      return;
    }

    if (stockItem.count < itemCount) {
      res.status(401).json({
        message: "Значение не может быть больше текущего количества",
      });
      return;
    }

    if (stockItem.count === itemCount) {
      const newEmptyItem = new NoneStock({
        itemType: "None",
        id: stockItem.id,
      });

      try {
        await newEmptyItem.save();

        await Stock.findByIdAndUpdate(
          currentStockId,
          {
            $pull: { items: currentStockItemId },
          },
          { new: true }
        );

        await Stock.findByIdAndUpdate(
          currentStockId,
          {
            $push: { items: newEmptyItem._id },
          },
          { new: true }
        );

        params.count = itemCount;
        params.id = newStockItem.id;
        params.description = "";

        let newStockItem_;

        switch (params.itemType) {
          case "Wheat":
            newStockItem_ = new WheatStock(params);
            break;
          case "Peas":
            newStockItem_ = new PeasStock(params);
            break;
          case "Sunflower":
            newStockItem_ = new SunflowerStock(params);
            break;
          case "None":
            newStockItem_ = new NoneStock(params);
            break;
          default:
            res.status(400).json({ message: "Неверный тип элемента" });
            return;
        }

        try {
          const savedNewStockItem = await newStockItem_.save();

          await Stock.findByIdAndUpdate(newStockId, {
            $push: { items: savedNewStockItem._id },
          });

          await ItemStock.findByIdAndDelete(newStockItemId);

          await ItemStock.findByIdAndDelete(currentStockItemId);

          res.status(200).json({ message: "Успешно!" });
          return;
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: "Не удалось перенести" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "Не удалось переместить",
        });
      }
    }

    if (stockItem.count > itemCount) {
      await ItemStock.findByIdAndUpdate(
        currentStockItemId,
        { $inc: { count: -itemCount } },
        { new: true }
      );

      params.count = itemCount;
      params.id = newStockItem.id;
      params.description = "";

      let newStockItem_;

      switch (params.itemType) {
        case "Wheat":
          newStockItem_ = new WheatStock(params);
          break;
        case "Peas":
          newStockItem_ = new PeasStock(params);
          break;
        case "Sunflower":
          newStockItem_ = new SunflowerStock(params);
          break;
        case "None":
          newStockItem_ = new NoneStock(params);
          break;
        default:
          res.status(400).json({ message: "Неверный тип элемента" });
          return;
      }

      try {
        const savedNewStockItem = await newStockItem_.save();

        await Stock.findByIdAndUpdate(
          newStockId,
          {
            $push: { items: savedNewStockItem._id },
          },
          { new: true }
        );

        await ItemStock.findByIdAndDelete(newStockItemId);

        res.status(200).json({ message: "Успешно!" });
        return;
      } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Не удалось перенести" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось переместить",
    });
  }
};

/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Create Shipment
 **/
export const createShipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { villageId, stockId, stockItemId } = req.body;

    const village = await Village.findById(villageId);
    const stock = await Stock.findById(stockId);
    const stockItem = await ItemStock.findById(stockItemId);

    if (!village) {
      res.status(404).json({
        message: "Не удалось найти населеннуй пункт",
      });

      return;
    } else if (!stock) {
      res.status(404).json({
        message: "Не удалось найти склад",
      });

      return;
    } else if (!stockItem) {
      res.status(404).json({
        message: "Не удалось найти ячейку",
      });

      return;
    }

    const totalPrice = Math.round(req.body.count * req.body.price);

    if (
      !req.body.count ||
      !req.body.agent ||
      !req.body.culture ||
      !req.body.price
    ) {
      res.status(401).json({
        message: "Пожалуйста, заполните все поля",
      });

      return;
    }

    const newShimpnet = new ShipmentHistory({
      count: req.body.count,
      agent: req.body.agent,
      culture: req.body.culture,
      price: req.body.price,
      totalPrice,
      village: villageId,
      stockItem: stockItemId,
      stock: stockId,
    });

    const shipment = await newShimpnet.save();

    try {
      if (stockItem.count === req.body.count) {
        const newEmptyItem = new NoneStock({
          itemType: "None",
          id: stockItem.id,
        });

        try {
          await newEmptyItem.save();

          await Stock.findByIdAndUpdate(
            stockId,
            {
              $pull: { items: stockItemId },
            },
            { new: true }
          );

          await Stock.findByIdAndUpdate(
            stockId,
            {
              $push: { items: newEmptyItem._id },
            },
            { new: true }
          );

          await Village.findByIdAndUpdate(villageId, {
            $push: { shipment: shipment._id },
          });

          await ItemStock.findByIdAndDelete(stockItemId);

          res.status(200).json({ message: "Успешно!" });

          return;
        } catch (err) {
          console.log(err);
          res.status(500).json({
            message: "Не удалось переместить",
          });
        }
      }

      if (stockItem.count > req.body.count) {
        await ItemStock.findByIdAndUpdate(
          stockItem,
          { $inc: { count: -req.body.count } },
          { new: true }
        );
      }

      await Village.findByIdAndUpdate(villageId, {
        $push: { shipment: shipment._id },
      });

      res.status(200).json(shipment);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось сохранить",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messahe: "Не удалось отгрузить",
    });
  }
};

/**
 * @param req
 * @param res
 * @access private
 * @copyright Copyright (c) 2024 The ISC License
 * @description Get Shipment History
 **/
export const getShipmentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const villageId = req.params.id;

    const village = await Village.findById(villageId);

    if (!village) {
      res.status(404).json({
        message: "Населенный пункт не найден",
      });
      return;
    }

    const shipmentItems = await Promise.all(
      village.shipment.map(async (itemId) => {
        return await ShipmentHistory.findById(itemId)
          .populate({ path: "village", select: "name" })
          .populate({ path: "stockItem", select: "itemType id" })
          .populate({ path: "stock", select: "name" })
          .exec();
      })
    );

    res.status(200).json(shipmentItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить историю отгрузок",
    });
  }
};

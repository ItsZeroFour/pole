import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetStocks } from "../../redux/slices/stock";
import { fetchGetStockItems } from "../../redux/slices/stockItems";
import { Link } from "react-router-dom";
import style from "./style.module.scss";

const Stocks = ({ currentVillageId }) => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock);
  const stockItems = useSelector((state) => state.stockItems);
  const [stockIds, setStockIds] = useState([]);

  useEffect(() => {
    dispatch(fetchGetStocks(currentVillageId));
  }, [dispatch, currentVillageId, stockIds]);

  useEffect(() => {
    setStockIds([]);
  }, [currentVillageId]);

  useEffect(() => {
    if (stocks.data) {
      const newStockIds = stocks.data.reduce((acc, stock) => {
        if (stock && stock._id && !stockIds.includes(stock._id)) {
          acc.push(stock._id);
        }
        return acc;
      }, []);
      if (newStockIds.length > 0) {
        setStockIds((prevStockIds) => [...prevStockIds, ...newStockIds]);
      }
    }
  }, [stocks.data, stockIds]);

  useEffect(() => {
    if (stockIds.length > 0) {
      dispatch(fetchGetStockItems(stockIds));
    }
  }, [stockIds, stockIds.length, dispatch]);

  const allIds = [1, 2, 3, 4];

  return (
    <ul className={style.stocks__list}>
      {stockItems.data &&
        stockItems.data.map(({ items, name, _id }) => {
          const wheatTotal = items
            .filter(({ itemType }) => itemType.toLowerCase() === "wheat")
            .reduce((sum, { count }) => sum + count, 0);

          const peasTotal = items
            .filter(({ itemType }) => itemType.toLowerCase() === "peas")
            .reduce((sum, { count }) => sum + count, 0);

          const sunflowerTotal = items
            .filter(({ itemType }) => itemType.toLowerCase() === "sunflower")
            .reduce((sum, { count }) => sum + count, 0);

          return (
            <li
              key={_id}
              style={{
                background:
                  name === "Обработка"
                    ? "#C0D3FF"
                    : name === "Сушка"
                    ? "#FEE2A2"
                    : "#d9d9d9",
              }}
            >
              <Link to={`/stockItems/${_id}`}>
                <h4>{name}</h4>

                <ul>
                  {name !== "Обработка" ? (
                    <React.Fragment>
                      <li>
                        <h4>Пшеница:</h4>
                        <h4>{wheatTotal === 0 ? "-" : `${wheatTotal} т.`}</h4>
                      </li>

                      {name !== "Сушка" && (
                        <React.Fragment>
                          <li>
                            <h4>Горох: </h4>
                            <h4>{peasTotal === 0 ? "-" : `${peasTotal} т.`}</h4>
                          </li>

                          <li>
                            <h4>Подсолнечник: </h4>

                            <h4>
                              {sunflowerTotal === 0
                                ? "-"
                                : `${sunflowerTotal} т.`}
                            </h4>
                          </li>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {allIds.map((id) => {
                        const item = items.find((item) => item.id === id);

                        if (!item) {
                          return (
                            <li key={id}>
                              <h4>--</h4>
                              <h4>-</h4>
                            </li>
                          );
                        }

                        const { itemType, count } = item;

                        return (
                          <li key={id}>
                            <h4>
                              {itemType.toLowerCase() === "wheat"
                                ? "Пшеница"
                                : itemType.toLowerCase() === "peas"
                                ? "Горох"
                                : itemType.toLowerCase() === "sunflower"
                                ? "Подсолнечник"
                                : "--"}
                            </h4>
                            <h4>{count} т.</h4>
                          </li>
                        );
                      })}
                    </React.Fragment>
                  )}
                </ul>
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default Stocks;

import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetStockItem,
  fetchGetStockItems,
} from "../../redux/slices/stockItems";
import { fetchGetStocks } from "../../redux/slices/stock";
import arrowBack from "../../assets/arrow.svg";
import logo from "../../assets/logo.png";
import { fetchGetAll } from "../../redux/slices/village";
import axios from "../../utils/axios";
import { fetchMove } from "../../redux/slices/moveStockItem";

const MoveStockItem = () => {
  const { stockItemId, stockId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [village, setVillage] = useState(null);
  const [stockIdSelect, setStockIdSelect] = useState("");
  const [stockItemIdSelected, setStockItemIdSelected] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [itemCount, setItemCount] = useState(1);

  const stockItem = useSelector((state) => state.stockItem.data);
  const stock = useSelector((state) => state.stockItems.data);
  const villages = useSelector((state) => state.villages.data);
  const stocksItems = useSelector((state) => state.stock.data);

  const handleClick = (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки
    navigate(`/updateItem/${stockItem._id}/${stock[0]._id}`, { replace: true }); // Навигация на указанную страницу
    window.location.reload(); // Перезагрузка страницы
  };

  function findObjectByStockId(objectsArray, stockId) {
    for (let obj of objectsArray) {
      for (let stock of obj.stocks) {
        if (stock === stockId) {
          return obj;
        }
      }
    }
    return null;
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setItemCount(value ? parseInt(value) : 0);
  };

  const handleFocus = (event) => {
    if (itemCount <= 1) {
      event.target.select();
    }
  };

  useEffect(() => {
    dispatch(fetchGetStockItem(stockItemId));
    dispatch(fetchGetStockItems([stockId]));
    dispatch(fetchGetAll());
  }, [stockItemId, stockId, dispatch]);

  useEffect(() => {
    village && dispatch(fetchGetStocks(village._id));
  }, [dispatch, village]);

  useEffect(() => {
    const getOurVillage = villages && findObjectByStockId(villages, stockId);

    setVillage(getOurVillage);
  }, [villages, stockId]);

  useEffect(() => {
    const fetchGetStockItems = async () => {
      if (stockIdSelect !== "") {
        try {
          const { data } = await axios.post(`/village/getStockItems`, {
            ids: [stockIdSelect],
          });

          if (!data) return alert("Не удалось получить ячейки склада");

          setStockItems(data[0].items);
        } catch (err) {
          alert("Произошла ошибка при получении ячеек склада");
        }
      }
    };

    fetchGetStockItems();
  }, [stockIdSelect]);

  const moveStockItem = async () => {
    try {
      const { _id, ...stockItemParams } = stockItem;

      if (!stockId || !stockItemIdSelected || !stockIdSelect) {
        return alert("Пожалуйста, заполните все поля");
      }

      const itemParams = {
        currentStockId: stockId,
        newStockItemId: stockItemIdSelected,
        newStockId: stockIdSelect,
        itemCount: itemCount === 0 && itemCount === 1 ? 1 : itemCount,
        ...stockItemParams,
      };

      // Дождаться завершения запроса
      const resultAction = await dispatch(
        fetchMove({ id: stockItemId, itemParams })
      );

      if (fetchMove.fulfilled.match(resultAction)) {
        alert("Успешно!");
        navigate(
          `/updateItem/${resultAction.payload.id}/${resultAction.payload.stockId}`
        );
        window.location.reload();
      } else {
        if (resultAction.payload) {
          alert(`Не удалось переместить: ${resultAction.payload.message}`);
        } else {
          alert("Не удалось переместить: неизвестная ошибка");
        }
      }
    } catch (err) {
      console.log(err);
      alert("Не удалось переместить");
    }
  };

  return (
    <section className={style.movestockitem}>
      <div className="container">
        <div className={style.movestockitem__wrapper}>
          {stock && stock.length !== 0 && stockItem ? (
            <React.Fragment>
              <div className={style.movestockitem__head}>
                <Link
                  to={`/updateItem/${stockItem._id}/${stock[0]._id}`}
                  onClick={handleClick}
                >
                  <img src={arrowBack} alt="arrow" />
                </Link>

                <div>
                  <h1>{stock[0].name}. Переместить</h1>
                  <h2>Ячейка {stockItem.id}</h2>
                </div>

                <img src={logo} alt="logo" />
              </div>

              <div className={style.movestockitem__panel}>
                <div className={style.movestockitem__name}>
                  <p>Наименование</p>
                  <h3>
                    {stockItem.itemType.toLowerCase() === "wheat"
                      ? "Пшеница"
                      : stockItem.itemType.toLowerCase() === "peas"
                      ? "Горох"
                      : stockItem.itemType.toLowerCase() === "sunflower"
                      ? "Подсолнечник"
                      : "Не найдено"}
                  </h3>
                </div>

                {stocksItems && (
                  <div>
                    <label htmlFor="select-stock">Склад</label>
                    <select
                      id="select-stock"
                      onChange={(event) => setStockIdSelect(event.target.value)}
                    >
                      <option value="" selected hidden>
                        Выберите склад
                      </option>
                      {stocksItems
                        .filter((item) => item !== null)
                        .map(({ _id, name }) => (
                          <option value={_id}>{name}</option>
                        ))}
                    </select>
                  </div>
                )}

                {stockItems && (
                  <div>
                    <label htmlFor="select-stock-item">Ячейка</label>
                    <select
                      id="select-stock-item"
                      onChange={(event) =>
                        setStockItemIdSelected(event.target.value)
                      }
                    >
                      <option value="" selected hidden>
                        {stockIdSelect && stockItems.length === 0
                          ? "Загрузка..."
                          : "Выберите ячейку"}
                      </option>
                      {stockItems
                        .filter(
                          ({ itemType }) => itemType.toLowerCase() === "none"
                        )
                        .map(({ id, _id }) => (
                          <option value={_id}>Ячейка {id}</option>
                        ))}
                    </select>
                  </div>
                )}

                <div className={style.movestockitem__count}>
                  <label htmlFor="number">Колличество</label>
                  <input
                    type="number"
                    id="number"
                    onChange={handleChange}
                    onFocus={handleFocus}
                    value={
                      itemCount <= 0
                        ? 1
                        : itemCount > stockItem.count
                        ? stockItem.count
                        : itemCount
                    }
                  />
                  <p>т.</p>

                  <span>Доступно {stockItem.count} т.</span>
                </div>

                <button onClick={moveStockItem}>Переместить</button>
              </div>
            </React.Fragment>
          ) : (
            <h1>Загрузка...</h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default MoveStockItem;

import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetStockItem,
  fetchGetStockItems,
} from "../../redux/slices/stockItems";
import { fetchGetAll } from "../../redux/slices/village";
import arrowBack from "../../assets/arrow.svg";
import logo from "../../assets/logo.png";
import { fetchCreateShipment } from "../../redux/slices/shipment";

const CreateShipment = () => {
  const { stockItemId, stockId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [village, setVillage] = useState(null);
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [agent, setAgent] = useState("");

  const stockItem = useSelector((state) => state.stockItem.data);
  const stock = useSelector((state) => state.stockItems.data);
  const villages = useSelector((state) => state.villages.data);

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
    setCount(value ? parseInt(value) : 0);
  };

  const handleFocus = (event) => {
    if (count <= 1) {
      event.target.select();
    }
  };

  const handleChangePrice = (event) => {
    const value = event.target.value;
    setPrice(value ? parseInt(value) : 0);
  };

  const handleFocusPrice = (event) => {
    if (price <= 0) {
      event.target.select();
    }
  };

  useEffect(() => {
    dispatch(fetchGetStockItem(stockItemId));
    dispatch(fetchGetStockItems([stockId]));
    dispatch(fetchGetAll());
  }, [stockItemId, stockId, dispatch]);

  useEffect(() => {
    const getOurVillage = villages && findObjectByStockId(villages, stockId);

    setVillage(getOurVillage);
  }, [villages, stockId]);

  const createShipment = async () => {
    if (!stockItem._id || !stock[0]._id || !village._id)
      return alert("404 Не удалось отгрузить");

    if (!count || !price || !agent) {
      return alert("Пожалуйста, заполните все поля");
    }

    dispatch(
      fetchCreateShipment({
        stockItemId: stockItem._id,
        stockId: stock[0]._id,
        villageId: village._id,
        count,
        agent,
        price,
        culture:
          stockItem.itemType.toLowerCase() === "wheat"
            ? "Пшеница"
            : stockItem.itemType.toLowerCase() === "peas"
            ? "Горох"
            : stockItem.itemType.toLowerCase() === "sunflower"
            ? "Подсолнечник"
            : "Не найдено",
      })
    );

    alert("Успешно!");
    navigate(`/stockItems${stockId}`);
  };

  return (
    <section className={style.createshipment}>
      <div className="container">
        {stock && stock.length !== 0 && stockItem ? (
          <React.Fragment>
            <div className={style.createshipment__head}>
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

            <div className={style.createshipment__wrapper}>
              <div className={style.createshipment__name}>
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

              <div>
                <label htmlFor="agent">Контрагент</label>
                <input
                  type="text"
                  id="agent"
                  onChange={(event) => setAgent(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="count">Колличество</label>
                <input
                  type="number"
                  id="number"
                  onChange={handleChange}
                  onFocus={handleFocus}
                  value={
                    count <= 0
                      ? 1
                      : count > stockItem.count
                      ? stockItem.count
                      : count
                  }
                />
                <span>Доступно: {stockItem.count}</span>
              </div>

              <div>
                <label htmlFor="price">Цена</label>
                <input
                  type="number"
                  id="number"
                  onChange={handleChangePrice}
                  onFocus={handleFocusPrice}
                  value={price <= 0 ? 0 : price}
                />
                <span>руб/т</span>
              </div>

              <div className={style.createshipment__sum}>
                <label htmlFor="totalSum">Сумма</label>
                <input
                  type="number"
                  disabled
                  id="totalSum"
                  value={Math.round(count * price)}
                />
                <span>руб</span>
              </div>

              <button onClick={createShipment}>Отгрузить</button>
            </div>
          </React.Fragment>
        ) : (
          <h2>Загрузка...</h2>
        )}
      </div>
    </section>
  );
};

export default CreateShipment;

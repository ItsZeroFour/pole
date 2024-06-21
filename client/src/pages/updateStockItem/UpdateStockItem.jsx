import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetStockItem,
  fetchGetStockItems,
} from "../../redux/slices/stockItems";
import backImg from "../../assets/arrow.svg";
import logo from "../../assets/logo.png";
import axios from "../../utils/axios";

const UpdateStockItem = () => {
  const { id, stockId } = useParams();
  const stockItem = useSelector((state) => state.stockItem.data);
  const stock = useSelector((state) => state.stockItems.data);
  const navigate = useNavigate();

  const [itemType, setItemType] = useState("");
  const [newItem, setNewItem] = useState(false);
  const [count, setCount] = useState(0);
  const [classItem, setClassItem] = useState(3);
  const [gluten, setGluten] = useState(0);
  const [grainAdmixture, setGrainAdmixture] = useState(0);
  const [impurity, setImpurity] = useState(0);
  const [IDK, setIDK] = useState(0);
  const [nature, setNature] = useState(0);
  const [broken, setBroken] = useState(0);
  const [damaged, setDamaged] = useState(0);
  const [cultivatedPlants, setCultivatedPlants] = useState(0);
  const [green, setGreen] = useState(0);
  const [weed, setWeed] = useState(0);
  const [sprouted, setSprouted] = useState(0);
  const [shriveled, setShriveled] = useState(0);

  const [humidity, setHumidity] = useState(0);
  const [oilImpurity, setOilImpurity] = useState(0);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetStockItem(id));
    dispatch(fetchGetStockItems([stockId]));
  }, [id, stockId, dispatch]);

  useEffect(() => {
    if (stockItem && stockItem.itemType.toLowerCase() === "none") {
      setNewItem(true);
    }
  }, [stockItem]);

  useEffect(() => {
    if (count <= 0) {
      setCount(0);
      setClassItem(0);
      setGluten(0);
      setGrainAdmixture(0);
      setImpurity(0);
      setIDK(0);
      setNature(0);
      setBroken(0);
      setDamaged(0);
      setCultivatedPlants(0);
      setGreen(0);
      setWeed(0);
      setSprouted(0);
      setShriveled(0);
      setHumidity(0);
      setOilImpurity(0);
    }
  }, [count]);

  useEffect(() => {
    if (stockItem) {
      /* Wheat */
      setDescription(stockItem.description);

      if (stockItem.itemType.toLowerCase() === "wheat") {
        setItemType(stockItem.itemType);
        setCount(stockItem.count);
        setHumidity(stockItem.humidity);
        setClassItem(stockItem.wheatParams.class);
        setGluten(stockItem.wheatParams.gluten);
        setBroken(stockItem.wheatParams.broken);
        setGrainAdmixture(stockItem.wheatParams.grainAdmixture);
        setImpurity(stockItem.wheatParams.impurity);
        setIDK(stockItem.wheatParams.IDK);
        setNature(stockItem.wheatParams.nature);
        setDamaged(stockItem.wheatParams.damaged);
        setCultivatedPlants(stockItem.wheatParams.cultivatedPlants);
        setGreen(stockItem.wheatParams.green);
        setWeed(stockItem.wheatParams.weed);
        setSprouted(stockItem.wheatParams.sprouted);
        setShriveled(stockItem.wheatParams.shriveled);
        /* Peas */
      } else if (stockItem.itemType.toLowerCase() === "peas") {
        setItemType(stockItem.itemType);
        setCount(stockItem.count);
        setHumidity(stockItem.humidity);
        setGrainAdmixture(stockItem.peasParams.grainAdmixture);
        setSprouted(stockItem.peasParams.sprouted);
        setShriveled(stockItem.peasParams.shriveled);
        setBroken(stockItem.peasParams.broken);
        setDamaged(stockItem.peasParams.damaged);
        setCultivatedPlants(stockItem.peasParams.cultivatedPlants);
        setGreen(stockItem.peasParams.green);
        setWeed(stockItem.peasParams.weed);
        setImpurity(stockItem.peasParams.impurity);
        /* Sunflower */
      } else if (stockItem.itemType.toLowerCase() === "sunflower") {
        setItemType(stockItem.itemType);
        setCount(stockItem.count);
        setHumidity(stockItem.humidity);
        setGrainAdmixture(stockItem.sunflowerParams.grainAdmixture);
        setSprouted(stockItem.sunflowerParams.sprouted);
        setBroken(stockItem.sunflowerParams.broken);
        setDamaged(stockItem.sunflowerParams.damaged);
        setCultivatedPlants(stockItem.sunflowerParams.cultivatedPlants);
        setGreen(stockItem.sunflowerParams.green);
        setWeed(stockItem.sunflowerParams.weed);
        setImpurity(stockItem.sunflowerParams.impurity);
        setOilImpurity(stockItem.sunflowerParams.oilImpurity);
      }
    }
  }, [stockItem]);

  const updateStockItem = async () => {
    try {
      if (count <= 0) {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "None",
          id: stockItem.id,
          description,
        });

        alert("Ячейка успешно обновлена!");
        return navigate(`/stockItems/${stockId}`);
      }

      if (newItem && itemType.toLowerCase() === "wheat") {
        const data = await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Wheat",
          id: stockItem.id,
          count,
          humidity,
          description,
          wheatParams: {
            class: classItem,
            gluten,
            grainAdmixture,
            impurity,
            IDK,
            nature,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            sprouted,
            shriveled,
          },
        });

        alert("Ячейка успешно обновлена!");
        return navigate(`/stockItems/${stockId}`);
      }

      if (newItem && itemType.toLowerCase() === "peas") {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Peas",
          id: stockItem.id,
          count,
          humidity,
          description,
          peasParams: {
            grainAdmixture,
            sprouted,
            shriveled,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            impurity,
          },
        });

        alert("Ячейка успешно обновлена!");
        return navigate(`/stockItems/${stockId}`);
      }

      if (newItem && itemType.toLowerCase() === "sunflower") {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Sunflower",
          id: stockItem.id,
          count,
          humidity,
          description,
          sunflowerParams: {
            grainAdmixture,
            sprouted,
            shriveled,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            impurity,
            oilImpurity,
          },
        });

        alert("Ячейка успешно обновлена!");
        return navigate(`/stockItems/${stockId}`);
      }

      if (itemType.toLowerCase() === "wheat") {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Wheat",
          id: stockItem.id,
          count,
          humidity,
          description,
          wheatParams: {
            class: classItem === 0 ? 3 : classItem,
            gluten,
            grainAdmixture,
            impurity,
            IDK,
            nature,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            sprouted,
            shriveled,
          },
        });
      } else if (itemType.toLowerCase() === "peas") {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Peas",
          id: stockItem.id,
          count,
          humidity,
          description,
          peasParams: {
            grainAdmixture,
            sprouted,
            shriveled,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            impurity,
          },
        });
      } else if (itemType.toLowerCase() === "sunflower") {
        await axios.patch(`/village/updateStockItem/${stockId}/${id}`, {
          itemType: "Sunflower",
          id: stockItem.id,
          count,
          humidity,
          description,
          sunflowerParams: {
            grainAdmixture,
            sprouted,
            shriveled,
            broken,
            damaged,
            cultivatedPlants,
            green,
            weed,
            impurity,
            oilImpurity,
          },
        });
      }

      alert("Ячейка успешно обновлена!");
      navigate(`/stockItems/${stockId}`);
      window.location.reload();
    } catch (err) {
      alert("500 Не удалось обновить ячейку");
    }
  };

  const handleCountChange = (event) => {
    const value = Math.min(Number(event.target.value), 100);
    setCount(value);
  };

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <section className={style.updatestockitem}>
      <div className="container">
        {stock && stock[0] && stockItem ? (
          <div className={style.updatestockitem__wrapper}>
            <div className={style.updatestockitem__top}>
              <Link to={`/stockItems/${stock[0]._id}`}>
                <img src={backImg} alt="back" />
              </Link>

              <div>
                <h1>{stock[0].name}. Лаборатория</h1>
                <h3>Ячейка {stockItem.id}</h3>
              </div>

              <img src={logo} alt="logo" />
            </div>

            <div className={style.updatestockitem__panel}>
              <div className={style.updatestockitem__main}>
                <h2>
                  {itemType !== "" && (
                    <>
                      Наименование:{" "}
                      {itemType.toLowerCase() === "wheat"
                        ? "Пшеница"
                        : itemType.toLowerCase() === "peas"
                        ? "Горох"
                        : itemType.toLowerCase() === "sunflower"
                        ? "Подсолнечник"
                        : "Пусто"}
                    </>
                  )}
                </h2>
                {itemType.toLowerCase() === "wheat" ? (
                  <div>
                    <ul>
                      <li>
                        <label htmlFor="">Колличество*</label>
                        <input
                          id="count"
                          type="number"
                          value={count}
                          onChange={handleCountChange}
			  max={100}
                        />
                        <p>т.</p>
                      </li>

                      <li>
                        <label htmlFor="">Класс</label>
                        <select
                          value={classItem}
                          onChange={(event) =>
                            setClassItem(parseInt(event.target.value))
                          }
                        >
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </li>

                      <li>
                        <label htmlFor="">Клейковина</label>
                        <input
                          type="number"
                          value={gluten}
                          onChange={(event) => setGluten(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">влажность</label>
                        <input
                          type="number"
                          value={humidity}
                          onChange={(event) => setHumidity(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">число падения</label>
                        <input
                          type="number"
                          value={shriveled}
                          onChange={(event) =>
                            setShriveled(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">зерновая примесь</label>
                        <input
                          type="number"
                          value={grainAdmixture}
                          onChange={(event) =>
                            setGrainAdmixture(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">проросшие</label>
                        <input
                          type="number"
                          value={sprouted}
                          onChange={(event) => setSprouted(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">щуплые</label>
                        <input
                          type="number"
                          value={weed}
                          onChange={(event) => setWeed(event.target.value)}
                        />
                        <p>%</p>
                      </li>
                    </ul>

                    <ul>
                      <li>
                        <label htmlFor="">битые</label>
                        <input
                          type="number"
                          value={broken}
                          onChange={(event) => setBroken(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">поврежденные</label>
                        <input
                          type="number"
                          value={damaged}
                          onChange={(event) => setDamaged(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">культурные растения</label>
                        <input
                          type="number"
                          value={cultivatedPlants}
                          onChange={(event) =>
                            setCultivatedPlants(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">зеленые</label>
                        <input
                          type="number"
                          value={green}
                          onChange={(event) => setGreen(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">сорная примесь</label>
                        <input
                          type="number"
                          value={impurity}
                          onChange={(event) => setImpurity(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">ИДК</label>
                        <input
                          type="number"
                          value={IDK}
                          onChange={(event) => setIDK(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">натура</label>
                        <input
                          type="number"
                          value={nature}
                          onChange={(event) => setNature(event.target.value)}
                        />
                        <p>%</p>
                      </li>
                    </ul>
                  </div>
                ) : itemType.toLowerCase() === "peas" ? (
                  <div>
                    <ul>
                      <li>
                        <label htmlFor="">Количество*</label>
                        <input
                          type="number"
			  onChange={handleCountChange}
                          max={100}
                          value={count}
                        />
                        <p>т.</p>
                      </li>

                      <li>
                        <label htmlFor="">влажность</label>
                        <input
                          type="number"
                          value={humidity}
                          onChange={(event) => setHumidity(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">зерновая примесь</label>
                        <input
                          type="number"
                          value={grainAdmixture}
                          onChange={(event) =>
                            setGrainAdmixture(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">Проросшие</label>
                        <input
                          type="number"
                          value={sprouted}
                          onChange={(event) => setSprouted(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">щуплые</label>
                        <input
                          type="number"
                          value={weed}
                          onChange={(event) => setWeed(event.target.value)}
                        />
                        <p>%</p>
                      </li>
                    </ul>

                    <ul>
                      <li>
                        <label htmlFor="">битые</label>
                        <input
                          type="number"
                          value={broken}
                          onChange={(event) => setBroken(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">поврежденные</label>
                        <input
                          type="number"
                          value={damaged}
                          onChange={(event) => setDamaged(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">культурные растения</label>
                        <input
                          type="number"
                          value={cultivatedPlants}
                          onChange={(event) =>
                            setCultivatedPlants(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">зеленые</label>
                        <input
                          type="number"
                          value={green}
                          onChange={(event) => setGreen(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">сорная примесь</label>
                        <input
                          type="number"
                          value={impurity}
                          onChange={(event) => setImpurity(event.target.value)}
                        />
                        <p>%</p>
                      </li>
                    </ul>
                  </div>
                ) : itemType.toLowerCase() === "sunflower" ? (
                  <div>
                    <ul>
                      <li>
                        <label htmlFor="">Колличество*</label>
                        <input
                          type="number"
                          value={count}
                          onChange={handleCountChange}
                          max={100}
                        />
                        <p>т.</p>
                      </li>

                      <li>
                        <label htmlFor="">влажность</label>
                        <input
                          type="number"
                          value={humidity}
                          onChange={(event) => setHumidity(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">сорная примесь</label>
                        <input
                          type="number"
                          value={impurity}
                          onChange={(event) => setImpurity(event.target.value)}
                        />
                        <p>%</p>
                      </li>

                      <li>
                        <label htmlFor="">масличная примесь</label>
                        <input
                          type="number"
                          value={oilImpurity}
                          onChange={(event) =>
                            setOilImpurity(event.target.value)
                          }
                        />
                        <p>%</p>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className={style.updatestockitem__new}>
                    <div className={style.updatestockitem__name__select}>
                      <h2>Наименование: </h2>
                      <select
                        onChange={(event) => setItemType(event.target.value)}
                      >
                        <option value="">Выбрать</option>
                        <option value="Wheat">Пшеница</option>
                        <option value="Peas">Горох</option>
                        <option value="sunflower">Подсолнечник</option>
                      </select>
                    </div>

                    {itemType === "Wheat" ? (
                      <div>
                        <ul>
                          <li>
                            <label htmlFor="count">Колличество*</label>
                            <input
                              id="count"
                              type="number"
                              value={count}
                              onChange={handleCountChange}
                              max={100}
                            />
                            <p>т.</p>
                          </li>

                          <li>
                            <label htmlFor="">Класс</label>
                            <input
                              type="number"
                              value={classItem}
                              onChange={(event) =>
                                setClassItem(event.target.value)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">Клейковина</label>
                            <input
                              type="number"
                              value={gluten}
                              onChange={(event) =>
                                setGluten(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">влажность</label>
                            <input
                              type="number"
                              value={humidity}
                              onChange={(event) =>
                                setHumidity(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">число падения</label>
                            <input
                              type="number"
                              value={shriveled}
                              onChange={(event) =>
                                setShriveled(event.target.damaged)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">зерновая примесь</label>
                            <input
                              type="number"
                              value={grainAdmixture}
                              onChange={(event) =>
                                setGrainAdmixture(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">проросшие</label>
                            <input
                              type="number"
                              value={sprouted}
                              onChange={(event) =>
                                setSprouted(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">щуплые</label>
                            <input
                              type="number"
                              value={weed}
                              onChange={(event) => setWeed(event.target.value)}
                            />
                            <p>%</p>
                          </li>
                        </ul>

                        <ul>
                          <li>
                            <label htmlFor="">битые</label>
                            <input
                              type="number"
                              value={broken}
                              onChange={(event) =>
                                setBroken(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">поврежденные</label>
                            <input
                              type="number"
                              value={damaged}
                              onChange={(event) =>
                                setDamaged(event.target.value)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">культурные растения</label>
                            <input
                              type="number"
                              value={cultivatedPlants}
                              onChange={(event) =>
                                setCultivatedPlants(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">зеленые</label>
                            <input
                              type="number"
                              value={green}
                              onChange={(event) => setGreen(event.target.value)}
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">сорная примесь</label>
                            <input
                              type="number"
                              value={impurity}
                              onChange={(event) =>
                                setImpurity(event.target.value)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">ИДК</label>
                            <input
                              type="number"
                              value={IDK}
                              onChange={(event) => setIDK(event.target.value)}
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">натура</label>
                            <input
                              type="number"
                              value={nature}
                              onChange={(event) =>
                                setNature(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>
                        </ul>
                      </div>
                    ) : itemType === "Peas" ? (
                      <div>
                        <ul>
                          <li>
                            <label htmlFor="">Количество*</label>
                            <input
                              type="number"
                              value={count}
                               onChange={handleCountChange}
                              max={100}

                            />
                            <p>т.</p>
                          </li>

                          <li>
                            <label htmlFor="">влажность</label>
                            <input
                              type="number"
                              value={humidity}
                              onChange={(event) =>
                                setHumidity(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">зерновая примесь</label>
                            <input
                              type="number"
                              value={grainAdmixture}
                              onChange={(event) =>
                                setGrainAdmixture(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">Проросшие</label>
                            <input
                              type="number"
                              value={sprouted}
                              onChange={(event) =>
                                setSprouted(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">щуплые</label>
                            <input
                              type="number"
                              value={weed}
                              onChange={(event) => setWeed(event.target.value)}
                            />
                            <p>%</p>
                          </li>
                        </ul>

                        <ul>
                          <li>
                            <label htmlFor="">битые</label>
                            <input
                              type="number"
                              value={broken}
                              onChange={(event) =>
                                setBroken(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">поврежденные</label>
                            <input
                              type="number"
                              value={damaged}
                              onChange={(event) =>
                                setDamaged(event.target.value)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">культурные растения</label>
                            <input
                              type="number"
                              value={cultivatedPlants}
                              onChange={(event) =>
                                setCultivatedPlants(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">зеленые</label>
                            <input
                              type="number"
                              value={green}
                              onChange={(event) => setGreen(event.target.value)}
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">сорная примесь</label>
                            <input
                              type="number"
                              value={impurity}
                              onChange={(event) =>
                                setImpurity(event.target.value)
                              }
                            />
                          </li>
                        </ul>
                      </div>
                    ) : itemType === "Sunflower" ? (
                      <div>
                        <ul>
                          <li>
                            <label htmlFor="">Колличество*</label>
                            <input
                              type="number"
                              value={count}
                               onChange={handleCountChange}
                              max={100}

                            />
                            <p>т.</p>
                          </li>

                          <li>
                            <label htmlFor="">влажность</label>
                            <input
                              type="number"
                              value={humidity}
                              onChange={(event) =>
                                setHumidity(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>

                          <li>
                            <label htmlFor="">сорная примесь</label>
                            <input
                              type="number"
                              value={impurity}
                              onChange={(event) =>
                                setImpurity(event.target.value)
                              }
                            />
                          </li>

                          <li>
                            <label htmlFor="">масличная примесь</label>
                            <input
                              type="number"
                              value={oilImpurity}
                              onChange={(event) =>
                                setOilImpurity(event.target.value)
                              }
                            />
                            <p>%</p>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h2>Пожалуйста, выберите элемент</h2>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {itemType && itemType.toLowerCase() !== "none" && (
                <div className={style.updatestockitem__links}>
                  <Link to={`/move/${stockItem._id}/${stock[0]._id}`}>
                    Переместить
                  </Link>
                  <Link
                    to={`/shipment/create/${stockItem._id}/${stock[0]._id}`}
                  >
                    Отгрузить
                  </Link>
                </div>
              )}
            </div>

            <p className={style.updatestockitem__note}>
              * добавляя количество актуализируйте остальные параметры
            </p>

            <div className={style.updatestockitem__description}>
              <label htmlFor="">Примечание</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
            </div>

            <div className={style.updatestockitem__button}>
              <button onClick={updateStockItem}>Сохранить</button>
            </div>
          </div>
        ) : (
          <h1>Загрузка...</h1>
        )}
      </div>
    </section>
  );
};

export default UpdateStockItem;

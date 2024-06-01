import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAll } from "../../redux/slices/village";
import { fetchGetShipmentHistory } from "../../redux/slices/shipment";
import { Link } from "react-router-dom";
import arrowBack from "../../assets/arrow.svg";
import logo from "../../assets/logo.png";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";

const ShipmentHistory = () => {
  const dispatch = useDispatch();
  const villages = useSelector((state) => state.villages.data);
  const shipmentHistory = useSelector((state) => state.shipment.data);

  const [currentVillageId, setCurrentVillageId] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    dispatch(fetchGetAll());
  }, [dispatch]);

  useEffect(() => {
    if (villages) {
      setCurrentVillageId(villages[0]._id);
    }
  }, [villages]);

  useEffect(() => {
    currentVillageId && dispatch(fetchGetShipmentHistory(currentVillageId));
  }, [currentVillageId, dispatch]);

  const itemsPerPage = 10;

  const items =
    shipmentHistory && shipmentHistory.length !== 0 ? shipmentHistory : [];

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  console.log(currentItems);

  return (
    <section className={style.shipmenthistory}>
      <div className="container">
        <div className={style.shipmenthistory__wrapper}>
          <div className={style.createshipment__head}>
            <Link to="/production">
              <img src={arrowBack} alt="arrow" />
            </Link>

            <h1>История отгрузок</h1>

            <img src={logo} alt="logo" />
          </div>

          {villages && (
            <React.Fragment>
              <ul className={style.shipmenthistory__villages}>
                {villages.map((item) => (
                  <li
                    key={item._id}
                    style={{
                      borderBottom:
                        item._id === currentVillageId ? "2px solid #F9C244" : 0,
                    }}
                  >
                    <button onClick={() => setCurrentVillageId(item._id)}>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>

              {shipmentHistory && currentItems ? (
                <React.Fragment>
                  <table>
                    <tr>
                      <th>дата</th>
                      <th>склад</th>
                      <th>контрагент</th>
                      <th>культура</th>
                      <th>количество, т</th>
                      <th>цена/т, руб</th>
                      <th>сумма, руб</th>
                    </tr>
                    {currentItems
                      .filter((elem) => elem !== null)
                      .map((item) => (
                        <tr key={item._id}>
                          <td>
                            <Moment format="DD.MM.YY">{item.createdAt}</Moment>
                          </td>

                          <td>{item.stock.name}</td>

                          <td>{item.agent}</td>

                          <td>{item.culture}</td>

                          <td>{item.count}</td>

                          <td>{item.price}</td>

                          <td>{item.totalPrice}</td>
                        </tr>
                      ))}
                  </table>

                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    containerClassName="page__container"
                    activeLinkClassName="page__link-active"
                    pageLinkClassName="page__link"
                    nextLinkClassName="page__next"
                    previousLinkClassName="page__prev"
                    renderOnZeroPageCount={null}
                  />
                </React.Fragment>
              ) : shipmentHistory === null ? (
                <h2>Загрузка...</h2>
              ) : (
                shipmentHistory.length === 0 && <h2>Пусто</h2>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShipmentHistory;

import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetStockItems } from "../../redux/slices/stockItems";
import arrowImage from "../../assets/arrow.svg";
import logo from "../../assets/logo.png";
import ReactPaginate from "react-paginate";

const StockItems = () => {
  const [itemOffset, setItemOffset] = useState(0);

  const { id } = useParams();

  const dispatch = useDispatch();
  const stockItems = useSelector((state) => state.stockItems);

  useEffect(() => {
    dispatch(fetchGetStockItems([id]));
  }, [id, dispatch]);

  const itemsPerPage = 15;

  const items =
    stockItems.data && stockItems.data[0] && stockItems.data[0].items
      ? stockItems.data[0].items
      : [];

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <section className={style.stockitems}>
      {stockItems.data && stockItems.data.length > 0 ? (
        <div className="container">
          <div className={style.stockItems__head}>
            <Link to="/productions">
              <img src={arrowImage} alt="back" />
            </Link>

            <h1>{stockItems.data[0].name}. Лаборатория</h1>

            <img src={logo} alt="logo" />
          </div>

          <ul className={style.stockitems__list}>
            {currentItems.map(({ _id, itemType, count, humidity, id }) => (
              <li key={_id}>
                <Link to={`/updateItem/${_id}/${stockItems.data[0]._id}`}>
                  <div className={style.stockitems__item__head}>
                    <p>{id}</p>
                    <p>
                      {itemType.toLowerCase() === "wheat"
                        ? "Пшеница"
                        : itemType.toLowerCase() === "peas"
                        ? "Горох"
                        : itemType.toLowerCase() === "sunflower"
                        ? "Подсолнечник"
                        : "---"}
                    </p>
                  </div>
                  <ul>
                    <li>
                      <p>Кол-во</p>
                      <p>{count > 0 ? count.toFixed(2) : "-"}т.</p>
                    </li>

                    <li>
                      <p>Влажность</p>
                      <p>{humidity > 0 ? humidity.toFixed(2) : "-"} %</p>
                    </li>
                  </ul>
                </Link>
              </li>
            ))}
          </ul>

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
        </div>
      ) : (
        <h2>Загрузка...</h2>
      )}
    </section>
  );
};

export default StockItems;

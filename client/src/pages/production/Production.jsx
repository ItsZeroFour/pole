import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAll } from "../../redux/slices/village";
import Stocks from "./Stocks";
import { Link } from "react-router-dom";

const Production = () => {
  const dispatch = useDispatch();
  const villages = useSelector((state) => state.villages.data);
  const [currentVillageId, setCurrentVillageId] = useState("");

  useEffect(() => {
    dispatch(fetchGetAll());
  }, [dispatch]);

  useEffect(() => {
    if (villages) {
      setCurrentVillageId(villages[0]._id);
    }
  }, [villages]);

  return (
    <section className={style.production}>
      <div className="container">
        <div className={style.production__wrapper}>
          <h1>Производство</h1>

          {villages && (
            <React.Fragment>
              <ul className={style.production__villages}>
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

                <li>
                  <Link to="/">История отгрузок</Link>
                </li>
              </ul>

              <Stocks currentVillageId={currentVillageId} />
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default Production;

import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, isLoading, selectIsAuth } from "./redux/slices/auth";
import React, { useEffect } from "react";
import Production from "./pages/production/Production";
import StockItems from "./pages/StockItems/StockItems";
import UpdateStockItem from "./pages/updateStockItem/UpdateStockItem";
import MoveStockItem from "./pages/MoveStockItem/MoveStockItem";
import CreateShipment from "./pages/Shipment/CreateShipment";
import ShipmentHistory from "./pages/Shipment/ShipmentHistory";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isLoadingMe = useSelector(isLoading);

  useEffect(() => {
    dispatch(fetchAuthMe());
    console.log("Client has been started");
  }, [dispatch]);

  return (
    <div className="App">
      <main>
        <Routes>
          {isLoadingMe === "loading" ? (
            <Route path="/loading" element={<h1>Загрузка...</h1>} />
          ) : isLoadingMe === "loaded" && !isAuth ? (
            <React.Fragment>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route path="/production" element={<Production />} />
              <Route path="/stockItems/:id" element={<StockItems />} />
              <Route
                path="/updateItem/:id/:stockId"
                element={<UpdateStockItem />}
              />
              <Route
                path="/move/:stockItemId/:stockId"
                element={<MoveStockItem />}
              />
              <Route
                path="/shipment/create/:stockItemId/:stockId"
                element={<CreateShipment />}
              />
              <Route path="/shipment/history" element={<ShipmentHistory />} />
              <Route path="*" element={<Navigate to="/production" />} />
            </React.Fragment>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;

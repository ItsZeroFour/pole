import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, isLoading, selectIsAuth } from "./redux/slices/auth";
import React, { useEffect } from "react";
import Production from "./pages/production/Production";
import StockItems from "./pages/StockItems/StockItems";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isLoadingMe = useSelector(isLoading);

  useEffect(() => {
    dispatch(fetchAuthMe());
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
              <Route path="*" element={<Navigate to="/production" />} />
            </React.Fragment>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;

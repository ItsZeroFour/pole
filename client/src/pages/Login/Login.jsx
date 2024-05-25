import React, { useState } from "react";
import style from "./style.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../redux/slices/auth";
import logo from "../../assets/logo.png";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const loginUser = async (event) => {
    event.preventDefault();

    const data = await dispatch(fetchLogin({ login, password }));

    if (!data.payload) {
      return alert("Не удалось войти");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  return (
    <section className={style.login}>
      <div className="container">
        <div className={style.login__wrapper}>
          <img src={logo} alt="logo" />
          
          <form onSubmit={loginUser}>
            <input
              type="text"
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Логин"
            />
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
            />
            <input type="submit" value="Вход" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

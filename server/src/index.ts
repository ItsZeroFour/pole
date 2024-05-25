import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js";
import VillageRoutes from "./routes/village.js";

dotenv.config({ path: "./.env" });
const app = express();

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI: string = process.env.MONGO_URI as string;
const corsOptions = {
  origin: 'http://ruspole.uer-ural.ru', // Замените на домен вашего React-приложения
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Разрешить отправку куки и авторизационных данных
};

/* MIDDLEWARES */
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

/* ROUTES */
app.use("/user", AuthRoutes);
app.use("/village", VillageRoutes);

/* START FUNCTION */
async function start() {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Mongo db connection successfully"))
      .catch((err) => console.log(err));

    app.listen(PORT, (err?: Error): void => {
      if (err) return console.log("Приложение аварийно завершилось: ", err);
      console.log(`Сервер успешно запущен! Порт: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();

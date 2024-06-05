import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js";
import VillageRoutes from "./routes/village.js";
// import https from "https";
// import fs from "fs";

dotenv.config({ path: "./.env" });
const app = express();

// const corsOptions = {
//   origin: "http://dev2.uer-ural.ru/",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders:
//     "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization",
//   exposedHeaders: "Content-Length,Content-Range",
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// const privateKey = fs.readFileSync("./certificate/ruspole_uer-ural.ru.key");
// const certificate = fs.readFileSync("./certificate/ruspole_uer-ural.ru.crt");

// const httpsServer = https.createServer(
//   {
//     key: privateKey,
//     cert: certificate,
//   },
//   app
// );

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI: string = process.env.MONGO_URI as string;

/* MIDDLEWARES */
app.use(express.json({ limit: "50mb" }));
app.use(cors());
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

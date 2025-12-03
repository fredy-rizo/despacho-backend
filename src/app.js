import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config.js";

import LawyerUser from "./routes/lawyerUserRoutes.js";
import FormReserve from "./routes/formReserveRoutes.js";

const app = express();
console.log(config);

app.set("port", config.PORT);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

app.use("/api/lawyer/user", LawyerUser);
app.use("/api/form/reserve", FormReserve);

export default app;

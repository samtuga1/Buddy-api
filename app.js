import express from "express";
import { json } from "body-parser";
require("dotenv").config();

import authRoutes from "./src/routes/auth";

const app = express();

app.use(json());
app.use("/account/user", authRoutes);

app.listen(process.env.PORT);

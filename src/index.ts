import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { defaultGetRouter } from "./routes/defaultGet";
import { defaultPostRouter } from "./routes/defaultPost";
import { authRoute } from "./routes/auth";
import { getSslServer } from "./utils/sslServerUtil";
dotenv.config();

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use("/", defaultGetRouter, defaultPostRouter, authRoute);

getSslServer(app)
    .then((server) => {
        if (!server) return;
        server.listen(process.env.PORT);
    })
    .catch((err) => console.log(err));

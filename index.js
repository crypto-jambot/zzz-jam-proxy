import express from "express";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

const sslServer = https.createServer(
    {
        key: fs.readFileSync(process.env.CERT_PRIVATE_KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PUBLIC_KEY_PATH),
    },
    app
);

app.post("/", async (req, res) => {
    //Validate API key
    if (req.headers["api-key"] === process.env.KEY) {
        const data = JSON.stringify(req.body);
        const config = {
            method: "post",
            url: process.env.HTTP,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            const response = await axios(config);
            res.json(response.data);
        } catch (err) {
            console.error(err);
            const { message, code } = err;
            res.status(400).json({ message, code });
        }
        return;
    }
    res.status(404).send("Failure to authenticate");
});

app.get("/", async (req, res) => {
    res.status(200).send("Nothing to see here...");
})

sslServer.listen(process.env.PORT);

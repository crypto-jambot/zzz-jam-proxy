import express from "express";
import jwt from "jsonwebtoken";
import https from "https";
import * as fs from "fs";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import sha256 from "sha256";

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
    const data = JSON.stringify(req.body);
    const accessToken = req.headers["access-token"];
    if (!accessToken) {
        res.status(400).send("Must include access-token header");
        return;
    }
    const config = {
        method: "post",
        url: process.env.HTTP,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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
});

app.get("/", async (req, res) => {
    res.status(200).send("Nothing to see here...");
});

app.get("/auth", async (req, res) => {
    const key = req.headers["api-key"];
    if (key && sha256(key) === process.env.KEY_HASH) {
        res.status(200).json({ token: signJwt() });
        return;
    }
    res.status(400).send("Unable to authenticate");
});

sslServer.listen(process.env.PORT);

function signJwt() {
    const privateKey = fs.readFileSync(process.env.JWT_PK);
    const expiresIn = 60 * 60;
    return {
        token: jwt.sign({ permissions: ["*:*"] }, privateKey, {
            algorithm: "RS256",
            expiresIn: expiresIn,
        }),
        expiresIn: expiresIn,
    };
}

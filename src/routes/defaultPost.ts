import express from "express";
import { errorType } from "../utils/types";
import axios from "axios";

export const defaultPostRouter = express.Router();

defaultPostRouter.post("/", async (req, res) => {
    // Validate API key
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
        data,
    };
    try {
        const response = await axios(config);
        res.json(response.data);
    } catch (err: unknown) {
        const { message, code } = err as errorType;
        res.status(400).json({ message, code });
    }
});

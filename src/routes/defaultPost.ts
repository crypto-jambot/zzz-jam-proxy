import express from "express";
import { makeCall } from "../utils/requestUtil";

export const defaultPostRouter = express.Router();

defaultPostRouter.post("/", async (req, res) => {
    // Validate API key

    const data = JSON.stringify(req.body);
    const accessToken = req.headers["access-token"] as string;
    if (!accessToken) {
        res.status(400).send("Must include access-token header");
        return;
    }
    const response = await makeCall(accessToken, req.body);
    if (response?.message) {
        res.status(400).json(response);
        return;
    }
    res.status(200).json(response);
});

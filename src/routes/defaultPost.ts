import express from "express";
import { makeCall } from "../utils/requestUtil";
import { errorType } from "../utils/types";

export const defaultPostRouter = express.Router();

defaultPostRouter.post("/", async (req, res) => {
    const accessToken = req.headers["access-token"] as string;
    if (!accessToken) {
        res.status(400).send("Must include access-token header");
        return;
    }
    try {
        const response = await makeCall(accessToken, req.body);
        res.status(200).send(response);
    } catch (err) {
        const { message, code, responseCode } = err as errorType;
        res.status(responseCode ?? 400).json({ message, code });
    }
});

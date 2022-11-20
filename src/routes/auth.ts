import express from "express";
import { signJwt } from "../utils/jwtUtil";
import sha256 from "sha256";

export const authRoute = express.Router();

authRoute.get("/auth", async (req, res) => {
    const key = req.headers["api-key"];
    if (key && sha256(key as string) === process.env.KEY_HASH) {
        res.status(200).json({ token: await signJwt() });
        return;
    }
    res.status(400).send("Unable to authenticate");
});

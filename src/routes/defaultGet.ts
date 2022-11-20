import express from "express";

export const defaultGetRouter = express.Router();

defaultGetRouter.get("/", async (req, res) => {
    res.status(200).send("Nothing to see here...");
});

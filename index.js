import express from "express";
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
			res.json(response);
		} catch (err) {
			console.error(err);
			const { message, code } = err;
			res.status(400).json({ message, code });
		}
		return;
	}
	res.status(404).send("Failure to authenticate");
});

app.listen(process.env.PORT);

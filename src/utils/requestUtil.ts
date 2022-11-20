import axios from "axios";
import { errorType } from "./types";

export async function makeCall(accessToken: string, data: string) {
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
        return response.data;
    } catch (err) {
        const { message, code } = err as errorType;
        return { message, code };
    }
}

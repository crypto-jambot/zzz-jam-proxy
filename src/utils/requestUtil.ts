import axios, { AxiosRequestConfig } from "axios";
import { errorType } from "./types";
import https from "https";

export async function makeCall(accessToken: string, data: string) {
    const config: AxiosRequestConfig = {
        method: "post",
        url: process.env.HTTP,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        data,
        httpsAgent: new https.Agent({ keepAlive: true }),
        maxBodyLength: Infinity,
    };
    return new Promise<Response>(async (resolve, reject) => {
        try {
            const response = await axios(config);
            resolve(response.data);
        } catch (err) {
            const { message, code } = err as errorType;
            reject({ message, code, responseCode: 400 });
        }
    });
}

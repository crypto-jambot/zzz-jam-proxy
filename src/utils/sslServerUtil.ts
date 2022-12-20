import https from "https";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";
import { Express } from "express";
import httpProxy from "http-proxy";
import * as process from "process";
import { CREDENTIALS as keyFile } from "../constant/constants";

const domainPrivateKeyClient = new SecretUtil({
    keyFile,
});
const domainPublicKeyClient = new SecretUtil({
    keyFile,
});

export const getSslServer = async (app: Express) => {
    const domainPrivateKey = await getKey(
        domainPrivateKeyClient,
        process.env.DOMAIN_PK_KEY as string
    );
    const domainPublicKey = await getKey(
        domainPublicKeyClient,
        process.env.DOMAIN_PUBK_KEY as string
    );
    if (!domainPrivateKey || !domainPublicKey) return;

    const sslServer = https.createServer(
        {
            key: domainPrivateKey as string,
            cert: domainPublicKey as string,
        },
        app
    );

    const proxy = httpProxy.createServer({
        target: process.env.WS as string,
        ws: true,
    });

    sslServer.on("upgrade", (req, socket, head) => {
        const accessToken = req.headers["access-token"];
        if (!accessToken) return;
        req.headers.Authorization = `Bearer ${accessToken as string}`;
        proxy.ws(req, socket, head);
    });

    return sslServer;
};

async function getKey(
    client: SecretUtil,
    key: string,
    version?: string
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const value: string = (
                await client.getSecret(key, version)
            ).toString();
            if (!value) {
                return;
            }
            resolve(value);
        } catch (err) {
            reject(err);
        }
    });
}

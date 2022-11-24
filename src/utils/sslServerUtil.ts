import https from "https";
import { SecretUtility } from "./secretManagerUtil";
import { Express } from "express";
import httpProxy from "http-proxy";

const domainPKClient = new SecretUtility();
const domainPubClient = new SecretUtility();

export const getSslServer = async (app: Express) => {
    const domainPrivateKey = await getKey(
        domainPKClient,
        process.env.DOMAIN_PK_KEY as string,
        "latest"
    );
    const domainPublicKey = await getKey(
        domainPubClient,
        process.env.DOMAIN_PUBK_KEY as string,
        "latest"
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
        req.headers["Authorization"] = `Bearer ${accessToken as string}`;
        proxy.ws(req, socket, head);
    });

    return sslServer;
};

async function getKey(client: SecretUtility, key: string, version: string) {
    try {
        return await client.getSecret(key, version);
    } catch (err) {
        console.log(err);
    }
}

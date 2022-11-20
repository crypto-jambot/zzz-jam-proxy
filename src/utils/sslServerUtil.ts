import https from "https";
import { SecretUtility } from "./secretManagerUtil";
import { Express } from "express";

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
    return https.createServer(
        {
            key: domainPrivateKey as string,
            cert: domainPublicKey as string,
        },
        app
    );
};

async function getKey(client: SecretUtility, key: string, version: string) {
    try {
        return await client.getSecret(key, version);
    } catch (err) {
        console.log(err);
    }
}

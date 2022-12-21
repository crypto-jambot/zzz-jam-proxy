import jwt, { JwtPayload } from "jsonwebtoken";
import { CREDENTIALS as keyFile } from "../constant/constants";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";

const besuPKClient = new SecretUtil({ keyFile });

export async function signJwt() {
    const privateKey = await besuPKClient.getSecretPayload(
        process.env.BESU_PK_KEY as string
    );
    if (!privateKey) return;
    const expiresIn = 60 * 60;
    const token = jwt.sign({ permissions: ["*:*"] }, privateKey.toString(), {
        algorithm: "RS256",
        expiresIn,
    });
    const { exp } = jwt.verify(token, privateKey.toString(), {
        algorithms: ["RS256"],
    }) as JwtPayload;
    return {
        token,
        exp,
    };
}

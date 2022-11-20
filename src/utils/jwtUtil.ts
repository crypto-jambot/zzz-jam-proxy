import jwt, { Secret } from "jsonwebtoken";
import { SecretUtility } from "./secretManagerUtil";
const besuPKClient = new SecretUtility();

export async function signJwt() {
    const privateKey = await besuPKClient.getSecret(
        process.env.BESU_PK_KEY as string,
        "latest"
    );
    if (!privateKey) return;
    const expiresIn = 60 * 60;
    return {
        token: jwt.sign({ permissions: ["*:*"] }, privateKey.toString(), {
            algorithm: "RS256",
            expiresIn,
        }),
        expiresIn,
    };
}

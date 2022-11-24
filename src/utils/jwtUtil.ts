import jwt, { JwtPayload } from "jsonwebtoken";
import { SecretUtility } from "./secretManagerUtil";
const besuPKClient = new SecretUtility();

export async function signJwt() {
    const privateKey = await besuPKClient.getSecret(
        process.env.BESU_PK_KEY as string,
        "latest"
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

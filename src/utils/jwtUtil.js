import jwt from "jsonwebtoken";
import * as fs from "fs";
import { v4 as uuidV4 } from "uuid";

const privateKey = fs.readFileSync(process.env.JWT_PK);

export function signJwt() {
    return jwt.sign({ id: uuidV4() }, privateKey, {
        algorithm: "RS256",
        expiresIn: 3600,
    });
}

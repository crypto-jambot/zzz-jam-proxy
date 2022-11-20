import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class SecretUtility {
    secret: string | Uint8Array | null | undefined;

    async getSecret(name: string, secretVersion: string) {
        if (!this.secret) {
            try {
                const client = new SecretManagerServiceClient({
                    keyFile: process.env.CREDENTIALS_PATH,
                });
                const projectId = await client.getProjectId();
                const [version] = await client.accessSecretVersion({
                    name: `projects/${projectId}/secrets/${name}/versions/${secretVersion}`,
                });
                this.secret = version!.payload!.data;
            } catch (err) {
                console.log(err);
            }
        }
        return this.secret;
    }
}

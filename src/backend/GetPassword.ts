import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function Start (SecretId: string, {
        secrets = new SecretsManagerClient({}),
    } = {}) {

    // get password
    const command = new GetSecretValueCommand({ SecretId })
    const password = await secrets.send(command)
        .then(res => {
            const value = res.SecretString
            const blob = JSON.parse(value)
            return blob["password"]
        })

    return password

}

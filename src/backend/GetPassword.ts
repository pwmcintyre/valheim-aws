import { SecretsManager } from 'aws-sdk'

export async function Start (SecretId: string, {
        secrets = new SecretsManager(),
    } = {}) {

    // get password
    const password = await secrets.getSecretValue({ SecretId }).promise()
        .then(res => {
            const value = res.SecretString
            const blob = JSON.parse(value)
            return blob["password"]
        })

    return password

}

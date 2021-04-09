import AWS from 'aws-sdk'

export function Start (SecretId = "", {
        secrets = new AWS.SecretsManager(),
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
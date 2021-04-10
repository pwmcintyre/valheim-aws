"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const aws_sdk_1 = require("aws-sdk");
async function Start(SecretId, { secrets = new aws_sdk_1.SecretsManager(), } = {}) {
    // get password
    const password = await secrets.getSecretValue({ SecretId }).promise()
        .then(res => {
        const value = res.SecretString;
        const blob = JSON.parse(value);
        return blob["password"];
    });
    return password;
}
exports.Start = Start;
//# sourceMappingURL=GetPassword.js.map
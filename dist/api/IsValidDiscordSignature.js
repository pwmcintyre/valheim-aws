"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidDiscordSignature = void 0;
// https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
const nacl = require("tweetnacl");
function IsValidDiscordSignature(key, signature, timestamp, body) {
    return nacl.sign.detached.verify(Buffer.from(timestamp + body), Buffer.from(signature, 'hex'), Buffer.from(key, 'hex'));
}
exports.IsValidDiscordSignature = IsValidDiscordSignature;
//# sourceMappingURL=IsValidDiscordSignature.js.map
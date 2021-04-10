"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Stop = exports.Start = void 0;
const dexlog_1 = require("dexlog");
const GetPublicIP_1 = require("../backend/GetPublicIP");
const Start_1 = require("../backend/Start");
async function Start(request, { start = Start_1.Start, logger = dexlog_1.StandardLogger, } = {}) {
    logger.debug("CMD: Start", { request });
    const cluster = process.env.CLUSTER;
    const service = process.env.SERVICE;
    const ip = await start(cluster, service);
    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": `${ip}`,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    };
}
exports.Start = Start;
async function Stop(request, { stop = (..._) => { throw new Error("not implemented"); }, logger = dexlog_1.StandardLogger, } = {}) {
    logger.debug("CMD: Stop", { request });
    const cluster = process.env.CLUSTER;
    const service = process.env.SERVICE;
    await stop(cluster, service);
    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": `it is done`,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    };
}
exports.Stop = Stop;
async function Get(request, { getIP = GetPublicIP_1.GetPublicIP, logger = dexlog_1.StandardLogger, } = {}) {
    logger.debug("CMD: Get", { request });
    const cluster = process.env.CLUSTER;
    const service = process.env.SERVICE;
    const ip = await getIP(cluster, service);
    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": `${ip}`,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    };
}
exports.Get = Get;
//# sourceMappingURL=commands.js.map
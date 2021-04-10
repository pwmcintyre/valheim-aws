"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const aws_sdk_1 = require("aws-sdk");
const dexlog_1 = require("dexlog");
// up handler
async function Start(cluster, service, { ecs = new aws_sdk_1.ECS(), ec2 = new aws_sdk_1.EC2(), logger = dexlog_1.StandardLogger, } = {}) {
    // start
    await ecs.updateService({ cluster, service, desiredCount: 1 }).promise();
    logger.debug("started", { cluster, service });
    // wait until stable
    await ecs.waitFor("servicesStable", { cluster, services: [service] }).promise();
    logger.debug("service stable", { cluster, service });
    // get task
    const task = await ecs.listTasks({ cluster, serviceName: service }).promise()
        .then(res => res.taskArns[0]);
    // wait until task stable / get ENI
    const eni = await ecs.waitFor("tasksRunning", { cluster, tasks: [task] }).promise()
        .then(res => res.tasks[0].attachments[0].details.filter(a => a.name == "networkInterfaceId")[0].value);
    logger.debug("task stable", { cluster, service, task });
    // get PublicIP
    const ip = await ec2.describeNetworkInterfaces({ NetworkInterfaceIds: [eni] }).promise()
        .then(res => res.NetworkInterfaces[0].Association.PublicIp);
    // respond
    return ip;
}
exports.Start = Start;
//# sourceMappingURL=Start.js.map
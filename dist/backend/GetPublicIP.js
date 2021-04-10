"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPublicIP = void 0;
const aws_sdk_1 = require("aws-sdk");
async function GetPublicIP(cluster, service, { ecs = new aws_sdk_1.ECS(), ec2 = new aws_sdk_1.EC2(), } = {}) {
    // get task
    const task = await ecs
        .listTasks({ cluster, serviceName: service })
        .promise()
        .then(res => res.taskArns[0]); // assumes 1 task (TODO ... do better)
    // wait until task stable / get ENI
    const eni = await ecs
        .waitFor("tasksRunning", { cluster, tasks: [task] })
        .promise()
        .then(res => {
        return res.tasks[0].attachments[0].details
            .filter(a => a.name == "networkInterfaceId")[0].value;
    });
    // get PublicIP
    const ip = await ec2
        .describeNetworkInterfaces({ NetworkInterfaceIds: [eni] })
        .promise()
        .then(res => res.NetworkInterfaces[0].Association.PublicIp);
    return ip;
}
exports.GetPublicIP = GetPublicIP;
//# sourceMappingURL=GetPublicIP.js.map
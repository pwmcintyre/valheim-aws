const a = require('./handler/libs')


const res = {
    "tasks": [
        {
            "attachments": [
                {
                    "id": "aff5aa6e-7d38-4e8b-8c83-7a2f8438db50",
                    "type": "ElasticNetworkInterface",
                    "status": "ATTACHED",
                    "details": [
                        {
                            "name": "subnetId",
                            "value": "subnet-00f68e489ab990e1a"
                        },
                        {
                            "name": "networkInterfaceId",
                            "value": "eni-059ca90be577ce815"
                        },
                        {
                            "name": "macAddress",
                            "value": "02:03:02:07:84:80"
                        },
                        {
                            "name": "privateDnsName",
                            "value": "ip-10-0-0-188.ap-southeast-2.compute.internal"
                        },
                        {
                            "name": "privateIPv4Address",
                            "value": "10.0.0.188"
                        }
                    ]
                }
            ],
            "availabilityZone": "ap-southeast-2a",
            "clusterArn": "arn:aws:ecs:ap-southeast-2:298125134431:cluster/pwmcintyre",
            "connectivity": "CONNECTED",
            "connectivityAt": "2021-03-23T08:58:50.266Z",
            "containers": [
                {
                    "containerArn": "arn:aws:ecs:ap-southeast-2:298125134431:container/pwmcintyre/0be27913512b49169d52914f6eb25854/867d1b06-b2ed-4fc7-b806-2d02d410f8b2",
                    "taskArn": "arn:aws:ecs:ap-southeast-2:298125134431:task/pwmcintyre/0be27913512b49169d52914f6eb25854",
                    "name": "pwmcintyre",
                    "image": "lloesche/valheim-server",
                    "runtimeId": "0be27913512b49169d52914f6eb25854-1442885117",
                    "lastStatus": "RUNNING",
                    "networkBindings": [],
                    "networkInterfaces": [
                        {
                            "attachmentId": "aff5aa6e-7d38-4e8b-8c83-7a2f8438db50",
                            "privateIpv4Address": "10.0.0.188"
                        }
                    ],
                    "healthStatus": "UNKNOWN",
                    "managedAgents": [
                        {
                            "lastStartedAt": "2021-03-23T08:59:30.148Z",
                            "name": "ExecuteCommandAgent",
                            "lastStatus": "RUNNING"
                        }
                    ],
                    "cpu": "0"
                }
            ],
            "cpu": "2048",
            "createdAt": "2021-03-23T08:58:44.932Z",
            "desiredStatus": "RUNNING",
            "enableExecuteCommand": true,
            "group": "service:pwmcintyre",
            "healthStatus": "UNKNOWN",
            "lastStatus": "RUNNING",
            "launchType": "FARGATE",
            "memory": "4096",
            "overrides": {
                "containerOverrides": [
                    {
                        "name": "pwmcintyre"
                    }
                ],
                "inferenceAcceleratorOverrides": []
            },
            "platformVersion": "1.4.0",
            "pullStartedAt": "2021-03-23T08:59:06.167Z",
            "pullStoppedAt": "2021-03-23T08:59:21.167Z",
            "startedAt": "2021-03-23T08:59:25.167Z",
            "startedBy": "ecs-svc/6794877665274647494",
            "tags": [],
            "taskArn": "arn:aws:ecs:ap-southeast-2:298125134431:task/pwmcintyre/0be27913512b49169d52914f6eb25854",
            "taskDefinitionArn": "arn:aws:ecs:ap-southeast-2:298125134431:task-definition/pwmcintyre:2",
            "version": 3
        }
    ],
    "failures": []
}


// const b = res.tasks[0].attachments[0].details.filter( a => a.name == "networkInterfaceId" )[0].value
// console.log(b)
// return

;(async () => {
    console.log("GetPassword", await a.GetPassword('pwmcintyre'))
})()

;(async () => {
    console.log("ServiceUp", await a.ServiceUp('pwmcintyre', 'pwmcintyre'))
})()

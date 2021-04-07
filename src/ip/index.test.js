import awsMock from 'aws-sdk-mock'
import it from '../../test/it/index.js'
import assert from 'assert'
import { GetPublicIP } from './index.js'

it("should return Public IP address of the services first task", async () => {

    // setup
    awsMock.mock('ECS', 'listTasks', { taskArns: ["fooarn"] })
    awsMock.mock('ECS', 'waitFor', {
        tasks: [{
            attachments: [{
                details: [{
                    name: "networkInterfaceId",
                    value: "eni-00000000000",
                }],
            }],
        }],
    })
    awsMock.mock('EC2', 'describeNetworkInterfaces', {
        NetworkInterfaces: [{
            Association: {
                PublicIp: "0.0.0.0",
            },
        }],
    })

    // run
    const result = GetPublicIP("foo", "bar")

    // assert
    await assert.doesNotReject(result.then( (ip) => {
        assert.deepStrictEqual(ip, "0.0.0.0")
        awsMock.restore()
    }))

})
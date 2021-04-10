import test from 'ava'
import * as aws from 'aws-sdk-mock'
import { Start } from './Start'

test.after('restore aws mocks', t => {
	aws.restore()
})

test('resolves with public ip address', async t => {

    // setup
    aws.mock('ECS', 'updateService', {})
    aws.mock('ECS', 'listTasks', { taskArns: ["fooarn"] })
    aws.mock('ECS', 'waitFor', {
        taskArns: ["fooarn"],
        tasks: [{
            attachments: [{
                details: [{
                    name: "networkInterfaceId",
                    value: "eni-00000000000",
                }],
            }],
        }],
    })
    aws.mock('EC2', 'describeNetworkInterfaces', {
        NetworkInterfaces: [{
            Association: {
                PublicIp: "0.0.0.0",
            },
        }],
    })

    // run
    const result = Start("foo", "bar")

    // assert
	t.is(await result, "0.0.0.0")

})

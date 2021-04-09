import test from 'ava'
import awsMock from 'aws-sdk-mock'
import { GetPublicIP } from './GetPublicIP.js'

test.after('restore aws mocks', t => {
	awsMock.restore()
})

test('resolves with public ip address', async t => {

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
	t.is(await result, "0.0.0.0")

})

import it from '../../../test/it/index.js'
import assert from 'assert'
import { Get } from './index.js'

it("should return discord message with Public IP address of server", async () => {

    // setup
    const mockGetIP = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    const result = Get(fakeRequest, mockGetIP)

    // assert
    await assert.doesNotReject(result.then((ip) => {
        assert.deepStrictEqual(ip, {
            data: {
                allowed_mentions: {
                    parse: []
                },
                content: '1.2.3.4',
                embeds: [],
                tts: false
            },
            type: 4
        })
    }))

})

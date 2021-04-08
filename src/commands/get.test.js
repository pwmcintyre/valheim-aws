import test from 'ava'
import dexlog from 'dexlog'
import { Get } from './get.js'

const logger = new dexlog.Logger(dexlog.LogLevel.DEBUG, t.log, undefined, [] )

test('resolves with discord message with public ip address', async t => {

    // setup
    const getFn = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    const result = Get(fakeRequest, { getFn, logger })

    // assert
    t.deepEqual( await result, {
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

})

import test from 'ava'
import dexlog from 'dexlog'
import * as commands from './commands.js'

test('resolves with discord message with public ip address', async t => {

    const logger = new dexlog.Logger(dexlog.LogLevel.DEBUG, t.log, undefined, [] )

    // setup
    const getIP = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    const result = commands.Get(fakeRequest, { getIP, logger })

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

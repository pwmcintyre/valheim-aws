import test from 'ava'
import * as dexlog from 'dexlog'
import * as commands from './commands'

test('resolves with discord message with public ip address', async t => {

    const logger = new dexlog.Logger(dexlog.LogLevel.DEBUG, t.log, undefined, [] )

    // setup
    const start = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    const result = commands.Start(fakeRequest, { start, logger })

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

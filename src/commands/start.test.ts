import test from 'ava'
import * as commands from './commands'
import { UpdateMessageFn } from './handler'

test('should post update message with public ip address', async t => {

    let updates: string[] = []
    const updater: UpdateMessageFn = (body: string) => {
        updates.push(body)
        return Promise.resolve()
    }

    // setup
    const start = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    await commands.Start(fakeRequest, updater, { start })

    // assert
    t.deepEqual( updates, [
        "starting server ...",
        "IP: 1.2.3.4",
    ])

})

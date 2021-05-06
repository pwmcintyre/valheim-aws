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
    const getIP = async () => "1.2.3.4"
    const fakeRequest = {}

    // run
    await commands.Get(fakeRequest, updater, { getIP })

    // assert
    t.deepEqual( updates, [
        "fetching details ...",
        "IP: 1.2.3.4",
    ])

})

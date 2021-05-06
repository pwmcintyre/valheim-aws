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
    const stop = async () => { return }
    const fakeRequest = {}

    // run
    await commands.Stop(fakeRequest, updater, { stop })

    // assert
    t.deepEqual( updates, [
        "stopping server ...",
        "server stopped",
    ])

})

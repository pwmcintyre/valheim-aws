const lib = require('.')
const assert = require('assert')

// MockService helps you mock any AWS Service
class MockService {

    constructor() {
        this.hits = []
    }

    // mock any function which takes a classic `service.action().promise()` signature.
    // name: function name
    // response: the promise returned by .promise()
    mock(name, response) {
        this.hits[name] = []
        this[name] = (...params) => {
            this.hits[name].push(params)
            return {
                promise: () => response
            }
        }
        return this
    }

}

// define tests
const tests = {

    "ServiceUp": {

        "returns IP address": async () => {

            // setup
            const ecs = new MockService()
                .mock("updateService", Promise.resolve())
                .mock("waitFor", Promise.resolve({
                        tasks: [{
                            attachments: [{
                                details: [{
                                    name: "networkInterfaceId",
                                    value: "0.0.0.0"
                                }]
                            }]
                        }]
                    })
                )

            // run
            const result = await lib.ServiceUp(ecs, "cluster", "service")

            // assert
            assert.deepStrictEqual(result, "0.0.0.0")
            assert.deepStrictEqual(ecs.hits["updateService"], [
                [
                    {
                        cluster: 'cluster',
                        service: 'service',
                        desiredCount: 1,
                    }
                ]
            ])
            assert.deepStrictEqual(ecs.hits["waitFor"], [
                [
                    'servicesStable',
                    {
                        cluster: 'cluster',
                        service: 'service',
                    }
                ]
            ])
        },

    },

    "GetVars": {
        "returns env vars for given keys in order": async () => {
            const [v2, v1] = lib.GetVars({ key1: "v1", key2: "v2" }, "key2", "key1")
            assert.deepStrictEqual(v1, "v1")
            assert.deepStrictEqual(v2, "v2")
        },
        "throws on missing key": async () => {
            try {
                lib.GetVars({}, "foo")
            } catch (error) {
                assert.strictEqual(error.message, "missing env var foo")
            }
        },
    }

}

// run tests
function step (tests, path = []) {
    for ( const key in tests ) {
        const val = tests[key]
        const name = [...path, key]
        switch (typeof val) {
            case 'function':
                val()
                    .then(_ => console.log('\x1b[32m%s \x1b[0m%s', '✔', name.join(" - ")))
                    .catch(error => console.log('\x1b[31m%s \x1b[0m%s\n%s', '✖', name.join(" - "), error))
                break
            case 'object':
                step(val, name)
        }
    }
}

step(tests)

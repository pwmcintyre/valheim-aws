// reference:
// https://github.com/pwmcintyre/dexlog

export default function log(message, context) {
    console.log(JSONSerializer({ message, ...context }))
}

export const JSONSerializer = (msg) => JSON.stringify(msg, getCircularReplacer())

// getCircularReplacer is Mozilla's suggested approach to dealing with circular references
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
function getCircularReplacer() {
    const seen = new WeakSet()
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return replaceErrors(key, value)
    }
}

function replaceErrors(_, value) {
    if (value instanceof Error) return value.toString()
    return value
}

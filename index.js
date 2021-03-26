const a = require('./handler/libs')


function log(message, context) {
    console.log(JSON.stringify({ message, ...context }))
}


;(async () => {
    console.log("GetPassword", await a.GetPassword('pwmcintyre'))
})()

;(async () => {
    console.log("ServiceUp", await a.ServiceUp('pwmcintyre', 'pwmcintyre'))
})()

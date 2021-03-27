const crypto = require('crypto')
const nacl = require('tweetnacl');


const algorithm = 'ed25519'

// valid
const signature = "dfbf903d3fd88d7bf0815c378030e59b1c0a5377e44d6b19f26554da2ab9ab61735f5775851ad1e47c71e9a26f081a39e95d5a62f7f91500bee89188e919d80f"
const timestamp = "1616819316"
const body = "{\"application_id\":\"825199647168659467\",\"id\":\"825224760131584049\",\"token\":\"aW50ZXJhY3Rpb246ODI1MjI0NzYwMTMxNTg0MDQ5OlRFM2JyakRnWTk0d2xDejdreFJjQkdZdWZuY1hpZzUwaWMzNWlaOVh0ME5GUjR4em16emJNb1M1dUFsU0xza0Z0T0pUUDdiNjllWTBVVmxCNENBdU92aExxSkhTQVFLOUJzOUtDeTloQlZrUEFRallMY1czNW1hT2tMZ2dkMHBz\",\"type\":1,\"user\":{\"avatar\":\"15afab3e4460d311461f8c3f7efb12dc\",\"discriminator\":\"5158\",\"id\":\"321619168833044481\",\"public_flags\":0,\"username\":\"spudweizer\"},\"version\":1}"

// invalid
// const signature = "ae8e6f0f5833c929e151922e0186cb13d7cdad907f525a6da47f46f1bbcc99ddb099472793952b80dbce3cbd021bda92a02fcb2e6b94af61f606c8e429415006"
// const timestamp = "1616819314"
// const body = "{\"application_id\":\"825199647168659467\",\"id\":\"825224760131584050\",\"token\":\"aW50ZXJhY3Rpb246ODI1MjI0NzYwMTMxNTg0MDUwOk1JNHRxSnExSGRyTmtiN2ZUdlNXTExabFYxUUVWNzhseVhFVGRLYU5uTm9UckRGUFlkVmdaN1hXMFRVWnh5VlpPOEk2bG9SaElMZzFGMTBRMlJ1NjlJTEdIcjQ2NTZwM3o5N3lmZ0VBTzJZRnE1WG9zQ2NoVHE4VnJkNHpyMEw3\",\"type\":1,\"user\":{\"avatar\":\"15afab3e4460d311461f8c3f7efb12dc\",\"discriminator\":\"5158\",\"id\":\"321619168833044481\",\"public_flags\":0,\"username\":\"spudweizer\"},\"version\":1}"

const data = Buffer.from(timestamp + body)

const key = ''

// crypto.verify(algorithm, data, key, signature)

// algorithm <string> | <null> | <undefined>
// data <Buffer> | <TypedArray> | <DataView>
// key <Object> | <string> | <Buffer> | <KeyObject>
// signature <Buffer> | <TypedArray> | <DataView>
// Returns: <boolean>

// console.log(crypto.verify(algorithm, data, null, signature))
// console.log(crypto.verify(algorithm, data, key, signature))
const PUBLIC_KEY = ''

const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);

console.log(isVerified)




try {
  const verify = crypto.createVerify(algorithm)
  // verify.write(timestamp)
  // verify.write(body)
  // verify.end()
  // console.log(verify.verify(PUBLIC_KEY, signature, 'hex'))
  console.log('valid')
} catch (error) {
  console.error("invalid", error)
}


// crypto.verify(algorithm, data, key, signature)

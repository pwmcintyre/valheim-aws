import { Lambda } from 'aws-sdk'

export async function Invoke(event: any, {
        FunctionName = process.env.COMMAND_FUNCTION_ARN,
        lambda = new Lambda(),
    } = {}) {
    
    // await lambda.invokeAsync({ FunctionName, InvokeArgs: JSON.stringify(event) }).promise()
    await lambda.invoke({ FunctionName, InvocationType: "Event", Payload: JSON.stringify(event) }).promise()
}

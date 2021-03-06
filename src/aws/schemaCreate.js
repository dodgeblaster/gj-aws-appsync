const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

/**
 * Note:
 * This file is taken from the file found in the existing appsync comp.
 * TODO: refactor this file
 * 
 */
const sleep = async (wait) => new Promise((resolve) => setTimeout(() => resolve(), wait))
const waitTillSchemaIsDone = (id) => {
    return new Promise(async (res) => {
        let waiting = true
        do {
            const res = await appsync.getSchemaCreationStatus({ apiId: id }).promise()
            const isDone = ['FAILED', 'SUCCESS', 'NOT_APPLICABLE'].includes(res.status)
            // TODO: shouldnt we be failing id the status is something other than success?
            if (isDone) {
                waiting = false
            } else {
                await sleep(500)
            }
        } while (waiting)
        res()
    })
}

module.exports = async (id, schema) => {
    try {
        const result = await appsync
            .startSchemaCreation({
                apiId: id,
                definition: Buffer.from(schema)
            })
            .promise()

        await waitTillSchemaIsDone(id)
        return {
            status: 'SUCCESS',
            data: result
        }

    } catch (e) {
        return {
            status: 'ERROR',
            e
        }
    }
}

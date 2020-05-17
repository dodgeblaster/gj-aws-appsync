const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async (id) => {
    try {
        const params = {
            apiId: id
        }
        const result = await appsync.createApiKey(params).promise()
        console.log('STATUS: Api Key Created')
        return {
            state: 'SUCCESS',
            data: result
        }
    } catch (e) {
        console.log('apikey - ', e)
        return {
            state: 'ERROR'
        }
    }
}
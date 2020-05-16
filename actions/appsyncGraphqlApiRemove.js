// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteGraphqlApi-property

const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async id => {
    const params = {
        apiId: id
    }

    await appsync.deleteGraphqlApi(params).promise()
}

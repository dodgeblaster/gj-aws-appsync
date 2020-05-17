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

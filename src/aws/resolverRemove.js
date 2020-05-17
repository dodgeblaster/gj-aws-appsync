const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})
module.exports = async ({ apiId, fieldName, typeName }) => {
    const params = {
        apiId,
        fieldName,
        typeName
    }
    await appsync.deleteResolver(params).promise()
}
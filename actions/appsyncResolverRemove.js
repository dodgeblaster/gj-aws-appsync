// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteResolver-property

module.exports = async ({ apiId, fieldName, typeName }) => {
    const params = {
        apiId,
        fieldName,
        typeName
    }
    await appsync.deleteResolver(params).promise()
}
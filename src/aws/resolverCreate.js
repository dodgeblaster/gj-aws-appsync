const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async ({ id, datasource, type, field, vtl }) => {
    const params = {
        apiId: id,
        fieldName: field,
        requestMappingTemplate: vtl.request,
        typeName: type,
        dataSourceName: datasource,
        responseMappingTemplate: vtl.response,

    };

    try {
        const result = await appsync.createResolver(params).promise()
        console.log('STATUS: Resolver Created')
        return {
            state: 'SUCCESS',
            data: result
        }
    } catch (e) {
        console.log('REASS  ERR- ', e)
        return {
            state: 'ERROR'
        }
    }
}
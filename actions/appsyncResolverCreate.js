// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createResolver-property

// EXAMPLE
// var params = {
//     apiId: 'STRING_VALUE', /* required */
//     fieldName: 'STRING_VALUE', /* required */
//     requestMappingTemplate: 'STRING_VALUE', /* required */
//     typeName: 'STRING_VALUE', /* required */
//     cachingConfig: {
//         cachingKeys: [
//             'STRING_VALUE',
//             /* more items */
//         ],
//         ttl: 'NUMBER_VALUE'
//     },
//     dataSourceName: 'STRING_VALUE',
//     kind: UNIT | PIPELINE,
//     pipelineConfig: {
//         functions: [
//             'STRING_VALUE',
//             /* more items */
//         ]
//     },
//     responseMappingTemplate: 'STRING_VALUE',
//     syncConfig: {
//         conflictDetection: VERSION | NONE,
//         conflictHandler: OPTIMISTIC_CONCURRENCY | LAMBDA | AUTOMERGE | NONE,
//         lambdaConflictHandlerConfig: {
//             lambdaConflictHandlerArn: 'STRING_VALUE'
//         }
//     }
// };

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
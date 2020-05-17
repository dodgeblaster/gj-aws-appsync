// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createDataSource-property

// EXAMPLE
// var params = {
//     apiId: 'STRING_VALUE', /* required */
//     name: 'STRING_VALUE', /* required */
//     type: AWS_LAMBDA | AMAZON_DYNAMODB | AMAZON_ELASTICSEARCH | NONE | HTTP | RELATIONAL_DATABASE, /* required */
//     description: 'STRING_VALUE',
//     dynamodbConfig: {
//         awsRegion: 'STRING_VALUE', /* required */
//         tableName: 'STRING_VALUE', /* required */
//         deltaSyncConfig: {
//             baseTableTTL: 'NUMBER_VALUE',
//             deltaSyncTableName: 'STRING_VALUE',
//             deltaSyncTableTTL: 'NUMBER_VALUE'
//         },
//         useCallerCredentials: true || false,
//         versioned: true || false
//     },
//     elasticsearchConfig: {
//         awsRegion: 'STRING_VALUE', /* required */
//         endpoint: 'STRING_VALUE' /* required */
//     },
//     httpConfig: {
//         authorizationConfig: {
//             authorizationType: AWS_IAM, /* required */
//             awsIamConfig: {
//                 signingRegion: 'STRING_VALUE',
//                 signingServiceName: 'STRING_VALUE'
//             }
//         },
//         endpoint: 'STRING_VALUE'
//     },
//     lambdaConfig: {
//         lambdaFunctionArn: 'STRING_VALUE' /* required */
//     },
//     relationalDatabaseConfig: {
//         rdsHttpEndpointConfig: {
//             awsRegion: 'STRING_VALUE',
//             awsSecretStoreArn: 'STRING_VALUE',
//             databaseName: 'STRING_VALUE',
//             dbClusterIdentifier: 'STRING_VALUE',
//             schema: 'STRING_VALUE'
//         },
//         relationalDatabaseSourceType: RDS_HTTP_ENDPOINT
//     },
//     serviceRoleArn: 'STRING_VALUE'
// };

const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async ({ id, name, config, type, roleArn }) => {
    const params = {
        apiId: id,
        name,
        type: type,
        serviceRoleArn: roleArn,
        ...config
    }

    try {
        await appsync.createDataSource(params).promise()
        console.log('STATUS: DataStore Created')

        return {
            state: 'SUCCESS'
        }
    } catch (e) {
        console.log('DATASTORE ERRR - ', e)
        return {
            state: 'ERROR'
        }
    }
}
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property

// EXAMPLE
// var params = {
//     authenticationType: API_KEY | AWS_IAM | AMAZON_COGNITO_USER_POOLS | OPENID_CONNECT, /* required */
//     name: 'STRING_VALUE', /* required */
//     additionalAuthenticationProviders: [
//         {
//             authenticationType: API_KEY | AWS_IAM | AMAZON_COGNITO_USER_POOLS | OPENID_CONNECT,
//             openIDConnectConfig: {
//                 issuer: 'STRING_VALUE', /* required */
//                 authTTL: 'NUMBER_VALUE',
//                 clientId: 'STRING_VALUE',
//                 iatTTL: 'NUMBER_VALUE'
//             },
//             userPoolConfig: {
//                 awsRegion: 'STRING_VALUE', /* required */
//                 userPoolId: 'STRING_VALUE', /* required */
//                 appIdClientRegex: 'STRING_VALUE'
//             }
//         },
//         /* more items */
//     ],
//     logConfig: {
//         cloudWatchLogsRoleArn: 'STRING_VALUE', /* required */
//         fieldLogLevel: NONE | ERROR | ALL, /* required */
//         excludeVerboseContent: true || false
//     },
//     openIDConnectConfig: {
//         issuer: 'STRING_VALUE', /* required */
//         authTTL: 'NUMBER_VALUE',
//         clientId: 'STRING_VALUE',
//         iatTTL: 'NUMBER_VALUE'
//     },
//     tags: {
//         '<TagKey>': 'STRING_VALUE',
//         /* '<TagKey>': ... */
//     },
//     userPoolConfig: {
//         awsRegion: 'STRING_VALUE', /* required */
//         defaultAction: ALLOW | DENY, /* required */
//         userPoolId: 'STRING_VALUE', /* required */
//         appIdClientRegex: 'STRING_VALUE'
//     },
//     xrayEnabled: true || false
// };

// EXAMPEL RESPONSE
// const x = {
//     graphqlApi:
//     {
//         name: 'GeneratedGraphqlAPI',
//         apiId: 'rulav2t3krhd7dqwf5vsod6qxm',
//         authenticationType: 'API_KEY',
//         arn: 'arn:aws:appsync:us-east-2:251256923172:apis/rulav2t3krhd7dqwf5vsod6qxm',
//         uris:
//         {
//             REALTIME: 'wss://nofessabyvejfi7dbparxga3uq.appsync-realtime-api.us-east-2.amazonaws.com/graphql',
//             GRAPHQL: 'https://nofessabyvejfi7dbparxga3uq.appsync-api.us-east-2.amazonaws.com/graphql'
//         },
//         tags: {},
//         xrayEnabled: false
//     }
// }


const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})
module.exports = async (name) => {
    const params = {
        authenticationType: 'API_KEY',
        name: name,
    }

    try {
        const result = await appsync.createGraphqlApi(params).promise()
        const name = result.graphqlApi.name
        const apiId = result.graphqlApi.apiId
        const endpoint = result.graphqlApi.uris.GRAPHQL

        console.log('STATUS: GraphQL Api Created')
        return {
            status: 'SUCCESS',
            data: {
                name,
                apiId,
                endpoint
            }
        }
    } catch (e) {
        console.log('graphql api error: ', e)
        return {
            status: 'ERROR'
        }
    }
}
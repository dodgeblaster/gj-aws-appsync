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
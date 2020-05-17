const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async () => {
    try {
        const params = {}
        const x = await appsync.listGraphqlApis(params).promise()
        return x.graphqlApis.map(x => ({
            name: x.name,
            apiId: x.apiId,
            endpoint: x.uris.GRAPHQL
        }))
    } catch (e) {
        if (e.code === 'NoSuchEntity') {
            return 'Does not exist'
        }
        throw e
    }
}


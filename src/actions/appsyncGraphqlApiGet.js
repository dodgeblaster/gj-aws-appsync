const AWS = require('aws-sdk')
const appsync = new AWS.AppSync({
    region: 'us-east-2'
})

module.exports = async (id) => {
    try {
        const params = {
            apiId: id
        }

        return await appsync.getGraphqlApi(params).promise()
    } catch (e) {
        if (e.code === 'NoSuchEntity') {
            return 'Does not exist'
        }
        throw e
    }
}


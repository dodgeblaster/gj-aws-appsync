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
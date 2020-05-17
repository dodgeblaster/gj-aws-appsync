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
        /**
         * Swallowing the create error if its saying, this already exists
         */
        if (e.message.includes(`Data source with name ${name} already exists`)) {
            console.log('STATUS - ', `Datasource with name ${name} already exists`)
            return {
                state: 'ERROR'
            }
        }
        /**
         * Currently swallowing all errors... need to think about how to handle
         * every resource created prior to this call if there is an error.
         *  - somehow reverse all previuosly created / updated resources
         *  - just throw the error and leave previously created / updated resources as is
         */
        console.log('DATASTORE ERRR - ', e)
        return {
            state: 'ERROR'
        }
    }
}
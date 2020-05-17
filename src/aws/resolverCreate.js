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
        /**
         * Swallowing the create error if its saying, this already exists
         */
        if (e.message.includes('Only one resolver is allowed per field')) {
            console.log(`STATUS: Resolver ${type}-${field} already exists.`)
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
        console.log('REASS  ERR- ', e)
        return {
            state: 'ERROR'
        }
    }
}
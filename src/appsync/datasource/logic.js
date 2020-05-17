const create = require('../../actions/appsyncDatasourceCreate')

module.exports = {
    createLambdaDataSource: async ({ id, name, roleArn, lambdaArn }) => {
        const config = {
            lambdaConfig: {
                lambdaFunctionArn: lambdaArn
            },
        }

        return await create({
            type: 'AWS_LAMBDA',
            id,
            name,
            config,
            roleArn
        })
    },

    createDynamoDbDataSource: async ({ id, name, roleArn, tableName }) => {
        const config = {
            dynamodbConfig: {
                awsRegion: 'us-east-2',
                tableName,
                // deltaSyncConfig: {
                //     baseTableTTL: 'NUMBER_VALUE',
                //     deltaSyncTableName: 'STRING_VALUE',
                //     deltaSyncTableTTL: 'NUMBER_VALUE'
                // },
                // useCallerCredentials: true || false,
                // versioned: true || false
            },
        }

        return await create({
            type: 'AMAZON_DYNAMODB',
            id,
            name,
            config,
            roleArn
        })
    }
}
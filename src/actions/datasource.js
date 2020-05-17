const create = require('../aws/datasourceCreate')

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
                tableName
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
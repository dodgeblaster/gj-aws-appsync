const appsyncApi = require('./src/actions/graphqlApi')
const appsyncApiKey = require('./src/actions/apiKey')
const appsyncSchema = require('./src/actions/schema')
const appsyncDatasource = require('./src/actions/datasource')
const appsyncResolver = require('./src/actions/resolver')
const iam = require('gj-aws-iam')
const utils = require('./src/utils')

const original = async ({ instructions }) => {
    let appsyncMonoLambdaDatasourceName = instructions.projectInfo.name.split(' ').join('') + 'lambdadatasource'



    /**
     * GraphQL API
     * 
     * This creates the graphql appsync app. Everything past this point
     * adds on to this base resource
     * 
     */

    let apiId = ''
    let apiName = ''
    if (instructions.graphQLApi.rootResource === 'CREATE') {
        const graphQLApiResponse = await appsyncApi.createGraphQLApi(instructions.projectInfo.name)
        apiId = graphQLApiResponse.data.apiId
        apiName = graphQLApiResponse.data.name
    }

    if (instructions.graphQLApi.rootResource === 'UPDATE') {
        apiId = instructions.projectInfo.id
        apiName = instructions.projectInfo.name
    }

    if (instructions.graphQLApi.rootResource === 'SKIP') {
        apiId = instructions.projectInfo.id
        apiName = instructions.projectInfo.name
    }



    /**
     * API Key
     * 
     * Appsync requires that some sort of authorization be defined.
     * For now we are defaulting to API Key, and generating one here
     * 
     */
    if (instructions.auth === 'CREATE') {
        await appsyncApiKey.createApiKey(apiId)
    }




    /**
     * Schema
     * 
     * Each type in the schema.graphl needs to be defined as a type
     * resource in appsync. For now we are just spliting the file string
     * by type, looping through it, and calling the createType sdk call
     * 
     */

    let schemaChecksum = ''
    if (instructions.schema === 'CREATE') {
        await appsyncSchema.createSchema(apiId, instructions.projectInfo.schema, '')
        schemaChecksum = utils.checksum(schema)
    }

    if (instructions.schema === 'UPDATE') {
        // TODO: add update action
        schemaChecksum = instructions.projectInfo.schemaChecksum
    }

    if (instructions.schema === 'SKIP') {
        schemaChecksum = instructions.projectInfo.schemaChecksum
    }




    /**
     * Datasource
     * 
     * Each Query and Mutation type will have a cooresponding datastore.
     * currently, we are not looping over the schema, but just creating
     * one, using an already existing lambda arn
     * 
     */

    let createdLambdaDatasourceRole = instructions.projectInfo.lambdaDatasourceRole || ''
    for (const datasourceIamRole of instructions.datasourceIamRoles) {
        if (datasourceIamRole.type === 'AWS_LAMBDA') {
            await iam.createRoleForLambdaDatasource({
                state: datasourceIamRole.state,
                name: datasourceIamRole.name
            })
            createdLambdaDatasourceRole = datasourceIamRole.name
        }

        if (datasourceIamRole.type === 'AMAZON_DYNAMODB') {
            await iam.createRoleForDynamoDbDatasource({
                state: datasourceIamRole.state,
                name: datasourceIamRole.name
            })
            createdLambdaDatasourceRole = datasourceIamRole.name
        }
    }

    for (const datasource of instructions.datasources) {
        if (datasource.type === 'AWS_LAMBDA') {
            appsyncMonoLambdaDatasourceName = datasource.name
            await appsyncDatasource.createLambdaDataSource({
                id: apiId,
                name: datasource.name,
                lambdaArn: datasource.lambdaArn,
                roleArn: datasource.roleArn
            })
        }

        if (datasource.type === 'AMAZON_DYNAMODB') {
            await appsyncDatasource.createDynamoDbDataSource({
                id: apiId,
                name: datasource.name,
                lambdaArn: datasource.lambdaArn,
                roleArn: datasource.roleArn,
                tableName: datasource.tableName
            })
        }
    }


    /**
     * Resolver
     * 
     * Each Datastore defined above needs to be connected to a type. This
     * is what the resolver is facilitating
     * 
     */
    for (const resolver of instructions.resolvers) {
        if (resolver.resolverType === 'FUNCTION') {
            await appsyncResolver.createMonoLambdaResolver({
                id: apiId,
                datasource: resolver.datasource,
                type: resolver.type,
                field: resolver.field
            })
        }

        if (resolver.resolverType === 'AMAZON_DYNAMODB') {
            await appsyncResolver.createDynamoDbResolver({
                id: apiId,
                datasource: resolver.datasource,
                type: resolver.type,
                field: resolver.field,
                action: resolver.action
            })
        }
    }

    return {
        apiId,
        apiName,
        schemaChecksum,
        lambdaDatasourceRole: createdLambdaDatasourceRole
    }
}



module.exports = async (instructions) => {
    /**
     * GraphQL API
     * 
     * This creates the graphql appsync app. Everything past this point
     * adds on to this base resource
     * 
     */
    let apiId
    let apiName
    let apiEndpoint
    const graphQLApiResponse = await appsyncApi.createGraphQLApi(instructions.name)
    apiId = graphQLApiResponse.data.apiId
    apiName = graphQLApiResponse.data.name
    apiEndpoint = graphQLApiResponse.data.endpoint
        // apiName = graphQLApiResponse.data.name
 
     /**
     * API Key
     * 
     * Appsync requires that some sort of authorization be defined.
     * For now we are defaulting to API Key, and generating one here
     * 
     */
    // if (instructions.auth === 'CREATE') {
        const k = await appsyncApiKey.createApiKey(apiId)
    // }
        const key = k.data.apiKey.id



    /**
     * Schema
     * 
     * Each type in the schema.graphl needs to be defined as a type
     * resource in appsync. For now we are just spliting the file string
     * by type, looping through it, and calling the createType sdk call
     * 
     */

    // let schemaChecksum = ''
    // if (instructions.schema === 'CREATE') {
        await appsyncSchema.createSchema(apiId, instructions.schema, '')
        // schemaChecksum = utils.checksum(schema)
    // }


    /**
     * Datasource
     * 
     * Each Query and Mutation type will have a cooresponding datastore.
     * currently, we are not looping over the schema, but just creating
     * one, using an already existing lambda arn
     * 
     */

    // let createdLambdaDatasourceRole = instructions.projectInfo.lambdaDatasourceRole || ''
    for (const datasourceIamRole of instructions.datasourceIamRoles) {
        if (datasourceIamRole.type === 'AWS_LAMBDA') {
            await iam.createRoleForLambdaDatasource({
                state: datasourceIamRole.state,
                name: datasourceIamRole.name
            })
            // createdLambdaDatasourceRole = datasourceIamRole.name
        }

        if (datasourceIamRole.type === 'AMAZON_DYNAMODB') {
            await iam.createRoleForDynamoDbDatasource({
                state: datasourceIamRole.state,
                name: datasourceIamRole.name
            })
            // createdLambdaDatasourceRole = datasourceIamRole.name
        }
    }

    for (const datasource of instructions.datasources) {
        if (datasource.type === 'AWS_LAMBDA') {
            // appsyncMonoLambdaDatasourceName = datasource.name
            await appsyncDatasource.createLambdaDataSource({
                id: apiId,
                name: datasource.name,
                lambdaArn: datasource.lambdaArn,
                roleArn: datasource.roleArn
            })
        }

        if (datasource.type === 'AMAZON_DYNAMODB') {
            await appsyncDatasource.createDynamoDbDataSource({
                id: apiId,
                name: datasource.name,
                lambdaArn: datasource.lambdaArn,
                roleArn: datasource.roleArn,
                tableName: datasource.tableName
            })
        }
    }


    /**
     * Resolver
     * 
     * Each Datastore defined above needs to be connected to a type. This
     * is what the resolver is facilitating
     * 
     */
    for (const resolver of instructions.resolvers) {
        if (resolver.resolverType === 'FUNCTION') {
            await appsyncResolver.createMonoLambdaResolver({
                id: apiId,
                datasource: resolver.datasource,
                type: resolver.type,
                field: resolver.field
            })
        }

        if (resolver.resolverType === 'AMAZON_DYNAMODB') {
            await appsyncResolver.createDynamoDbResolver({
                id: apiId,
                datasource: resolver.datasource,
                type: resolver.type,
                field: resolver.field,
                action: resolver.action
            })
        }
    }

    return {
        apiId,
        keyId: key,
        apiName,
        apiEndpoint
    }
}
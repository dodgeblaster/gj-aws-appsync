const appsyncApi = require('./src/actions/graphqlApi')
const appsyncApiKey = require('./src/actions/apiKey')
const appsyncSchema = require('./src/actions/schema')
const appsyncDatasource = require('./src/actions/datasource')
const appsyncResolver = require('./src/actions/resolver')
const iam = require('gj-aws-iam')



const awaitPromises = list => {
    return Promise.all(list.map(x => x()))
}

module.exports.deploy = async (instructions) => {
    /**
     * GraphQL API
     * 
     * This creates the graphql appsync app. Everything past this point
     * adds on to this base resource. When creating, it first checks if
     * it exists, if it does, it will return existing info rather than
     * creating a new one
     * 
     * TODO: make a config to determine whether to attempt create or just
     * return alreadyExisting info store in state.
     * 
     * QUESTION: should thinking about state not be a concern at all
     * when building this component? We wouldnt have to if we just try
     * to create everythign all the time, if it exists, switch to updating
     * but that means makes updates are inefficient
     * 
     */
    let apiId
    let apiName
    let apiEndpoint
    const graphQLApiResponse = await appsyncApi.createGraphQLApi(instructions.name)
    apiId = graphQLApiResponse.data.apiId
    apiName = graphQLApiResponse.data.name
    apiEndpoint = graphQLApiResponse.data.endpoint
  
 

     /**
     * API Key
     * 
     * Appsync requires that some sort of authorization be defined.
     * For now we are defaulting to API Key, and generating one here
     * 
     */
    let key
    if (instructions.auth.state === 'CREATE') {
        const k = await appsyncApiKey.createApiKey(apiId)
        key = k.data.apiKey.id
    } else {
        key = instructions.auth.existingKey
    }



    /**
     * Schema
     * 
     * Each type in the schema.graphl will be dfined with the 
     * createSchema sdk call. If this function is called and the
     * schema already exists, it will update the schema.
     *
     */
    if (instructions.schema.state === 'CREATE' || instructions.schema.state === 'UPDATE') {
        await appsyncSchema.createSchema(apiId, instructions.schema.defintion, '')
    }



    /**
     * Datasource IAM
     * 
     * Each Datasource needs an IAM role, before creating datasources, we will
     * create a promiselist of all roles to be created and create them all at once
     * 
     */
    let dsIamPromiseList = []
    for (const datasourceIamRole of instructions.datasourceIamRoles.create) {
        if (datasourceIamRole.type === 'AWS_LAMBDA') {
            dsIamPromiseList.push(async () => {
                return await iam.createRoleForLambdaDatasource({
                    state: datasourceIamRole.state,
                    name: datasourceIamRole.name
                })
            })
        }

        if (datasourceIamRole.type === 'AMAZON_DYNAMODB') {
            dsIamPromiseList.push(async () => {
                return await iam.createRoleForDynamoDbDatasource({
                    state: datasourceIamRole.state,
                    name: datasourceIamRole.name
                })
            })
        }
    }
    await awaitPromises(dsIamPromiseList)
    


    /**
     * Datasource
     * 
     * Each Query and Mutation type will have a cooresponding datastore.
     * After all datasource Iam roles are created, we create a promise
     * list of all datasources that need to be created and create them 
     * all at once
     * 
     */
    let dsPromiseList = []
    for (const datasource of instructions.datasources.create) {
        if (datasource.type === 'AWS_LAMBDA') {
            dsPromiseList.push(async () => {
                await appsyncDatasource.createLambdaDataSource({
                    id: apiId,
                    name: datasource.name,
                    lambdaArn: datasource.lambdaArn,
                    roleArn: datasource.roleArn
                })
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
    await awaitPromises(dsPromiseList)



    /**
     * Resolver
     * 
     * Each Resolver needs to connect a type to a datasource. Here
     * we create a list of promises to create resolvers, and create
     * them all at once
     * 
     */
    let resolverPromiseList = []
    for (const resolver of instructions.resolvers.create) {
        if (resolver.resolverType === 'AWS_LAMBDA') {
            resolverPromiseList.push(async () => {
                await appsyncResolver.createMonoLambdaResolver({
                    id: apiId,
                    datasource: resolver.datasource,
                    type: resolver.type,
                    field: resolver.field,
                    vtl: resolver.vtl
                })
            })
        }

        if (resolver.resolverType === 'AMAZON_DYNAMODB') {
            resolverPromiseList.push(async () => {
                await appsyncResolver.createDynamoDbResolver({
                    id: apiId,
                    datasource: resolver.datasource,
                    type: resolver.type,
                    field: resolver.field,
                    vtl: resolver.vtl
                })
            })
        }
    }
    await awaitPromises(resolverPromiseList)



    /**
     * Output
     * 
     * Each time we run this function, we will return
     * the following:
     * 
     */
    return {
        apiId,
        keyId: key,
        apiName,
        apiEndpoint
    }
}


module.exports.remove = async (id) => {
    await appsyncApi.removeGraphQLApi(id)
}
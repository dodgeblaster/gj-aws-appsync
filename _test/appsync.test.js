const appsync = require('../index')
const fetch = require('node-fetch')
const iam = require('gj-aws-iam')
const api = require('../src/actions/graphqlApi')
const ACCOUNT_ID = '251256923172'
const retry = require('async-retry')

const testLambdaArn = `arn:aws:lambda:us-east-2:${ACCOUNT_ID}:function:int-test-appsynclambda`
const testLambdaRoleName = 'int-test-aaa'
const testDynamoDbRoleName = 'int-test-bbb'

const schema = `
type Hello {
    hello: String
    id: String
    name: String
}

type Product {
    id: String
    name: String
}

type Extra {
    id: String
    product: String
}

type Query {
    getHello: Hello
    something: Product
    product: Extra
    getProduct: Extra
}
`
describe('appsync', () => {
    test('can create an api endpoint', async (done) => {
        // * * * * * * * * * * * * * * * * * * * * * * * * 
        // BUILD
        // * * * * * * * * * * * * * * * * * * * * * * * * 
        console.time('LONG IT TAKES')
        const instructions = {
            name: 'DEMO-APP',
            auth: {
                state: 'CREATE',
                existingKey: null
            },
            schema: {
                state: 'CREATE',
                defintion: schema
            },
            datasourceIamRoles: {
                create: [
                    {
                        type: 'AWS_LAMBDA',
                        state: '',
                        name: testLambdaRoleName
                    },
                    {
                        type: 'AMAZON_DYNAMODB',
                        state: '',
                        name: testDynamoDbRoleName
                    }
                ]
            },
            datasources: {
                create: [
                    {
                        type: 'AWS_LAMBDA',
                        name: `inttestdatasourceLAMBDA`,
                        lambdaArn: testLambdaArn,
                        roleArn: `arn:aws:iam::${ACCOUNT_ID}:role/${testLambdaRoleName}`,
                        roleName: testLambdaRoleName
                    },
                    {
                        type: 'AMAZON_DYNAMODB',
                        name: `inttestdatasourceDYNAMO`,
                        tableName: 'int-test-appsyncdb',
                        roleArn: `arn:aws:iam::${ACCOUNT_ID}:role/${testDynamoDbRoleName}`,
                        roleName: testDynamoDbRoleName
                    }
                ]
            },
            resolvers: {
                create: [
                    {
                        resolverType: 'AWS_LAMBDA',
                        type: 'Query',
                        field: 'getHello',
                        datasource: `inttestdatasourceLAMBDA`,
                        vtl: {
                            request: `{ 
                                "version": "2017-02-28",
                                "operation": "Invoke",
                                "payload": $util.toJson($ctx)
                            }`,
                            response: `$util.toJson($ctx.result)`
                        }
                    },
                    {
                        resolverType: 'AWS_LAMBDA',
                        type: 'Query',
                        field: 'something',
                        datasource: `inttestdatasourceLAMBDA`,
                        vtl: {
                            request: `{ 
                                "version": "2017-02-28",
                                "operation": "Invoke",
                                "payload": $util.toJson($ctx)
                            }`,
                            response: `$util.toJson($ctx.result)`
                        }
                    },
                    {
                        resolverType: 'AWS_LAMBDA',
                        type: 'Query',
                        field: 'product',
                        datasource: `inttestdatasourceLAMBDA`,
                        vtl: {
                            request: `{ 
                                "version": "2017-02-28",
                                "operation": "Invoke",
                                "payload": $util.toJson($ctx)
                            }`,
                            response: `$util.toJson($ctx.result)`
                        }
                    },
                    {
                        resolverType: 'AMAZON_DYNAMODB',
                        type: 'Query',
                        field: 'getProduct',
                        datasource: `inttestdatasourceDYNAMO`,
                        vtl: {
                            request: `{
                                "version": "2017-02-28",
                                "operation": "GetItem",
                                "key": {
                                    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
                                },
                            }`,
                            response: `$util.toJson($ctx.result)`
                        }
                    }    
                ]
            }
        }
        
        const result = await appsync(instructions)
        console.timeEnd('LONG IT TAKES')

        // * * * * * * * * * * * * * * * * * * * * * * * * 
        // TEST
        // * * * * * * * * * * * * * * * * * * * * * * * * 
        await retry(async bail => {
            console.log('trying... ')
            const res = await fetch(result.apiEndpoint, {
                method: 'post',
                body: JSON.stringify({
                    query: `{
                        getHello {
                            id
                        }
                    }
                    `
                }),
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': result.keyId
                },
            })
    
            const cResult = await res.json()
            console.log('+++ ', cResult)
            expect(cResult.data.getHello.id).toBe('1234')
        }, {
            retries: 4
        })
      



        // * * * * * * * * * * * * * * * * * * * * * * * * 
        // CLEANUP
        // * * * * * * * * * * * * * * * * * * * * * * * *        
        await iam.removeRole(testLambdaRoleName)
        await iam.removeRole(testDynamoDbRoleName)
        await api.removeGraphQLApi(result.apiId)
        
        done()
    }, 300000)
})
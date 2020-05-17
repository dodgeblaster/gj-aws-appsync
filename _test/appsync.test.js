const appsync = require('../index')
const fetch = require('node-fetch')
const iam = require('gj-aws-iam')
const api = require('../src/appsync/graphqlApi/logic')
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

        // const x = await listApis()
        // console.log(' = == ', x)
        // done()
        // return
        // * * * * * * * * * * * * * * * * * * * * * * * * 
        // BUILD
        // * * * * * * * * * * * * * * * * * * * * * * * * 
        console.time('LONG IT TAKES')
        const instructions = {
            name: 'DEMO-APP',
            schema,
            datasourceIamRoles: [
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
            ],
            datasources: [
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
            ],
            resolvers: [
                {
                    resolverType: 'FUNCTION',
                    type: 'Query',
                    field: 'getHello',
                    datasource: `inttestdatasourceLAMBDA`
                },
                {
                    resolverType: 'FUNCTION',
                    type: 'Query',
                    field: 'something',
                    datasource: `inttestdatasourceLAMBDA`
                },
                {
                    resolverType: 'FUNCTION',
                    type: 'Query',
                    field: 'product',
                    datasource: `inttestdatasourceLAMBDA`
                },
                {
                    resolverType: 'AMAZON_DYNAMODB',
                    type: 'Query',
                    field: 'getProduct',
                    action: 'GET',
                    datasource: `inttestdatasourceDYNAMO`
                },
               
            ]
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
            retries: 3
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
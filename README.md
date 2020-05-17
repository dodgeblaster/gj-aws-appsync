# gj-aws-appsync

## Installation
In order to add this package to your service, run the following command:
```
npm i gj-aws-appsync
```

## Usage

```js

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
                name: 'testLambdaRoleName'
            },
            {
                type: 'AMAZON_DYNAMODB',
                state: '',
                name: 'testDynamoDbRoleName'
            }
        ]
    },
    datasources: {
        create: [
            {
                type: 'AWS_LAMBDA',
                name: `inttestdatasourceLAMBDA`,
                lambdaArn: 'testLambdaArn',
                roleArn: `arn:aws:iam::12341234:role/testLambdaRoleName`,
                roleName: 'testLambdaRoleName'
            },
            {
                type: 'AMAZON_DYNAMODB',
                name: `inttestdatasourceDYNAMO`,
                tableName: 'int-test-appsyncdb',
                roleArn: `arn:aws:iam::12341234:role/testDynamoDbRoleName`,
                roleName: 'testDynamoDbRoleName'
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
            },
            
        ]
    }
}

const result = await appsync(instructions)
/* 
return {
    apiId: String
    keyId: String
    apiEndpoint: String
    apiName: String
}
*/
````
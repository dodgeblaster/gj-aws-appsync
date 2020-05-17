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
    schema,
    datasourceIamRoles: [
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
    ],
    datasources: [
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
/* 
return {
    apiId: String
    keyId: String
    apiEndpoint: String
    apiName: String
}
*/
````
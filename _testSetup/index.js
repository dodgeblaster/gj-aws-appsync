const iam = require('gj-aws-iam')
const lambda = require('gj-aws-lambda')
const dynamodb = require('gj-aws-dynamodb')
const ACCOUNT_ID = '251256923172'


const main = async () => {
    const srcLocation = __dirname + '/exampleProject/src'
    const zipLocation = __dirname + '/exampleProject/.serverless/code.zip'
    
    const appsyncLambdaRole = 'int-test-appsynclambdarole'
    const appsyncLambdaName = 'int-test-appsynclambda'
    const dbName = 'int-test-appsyncdb'

    console.log('setting up...')

    await iam.createRoleForLambda({
        state: false,
        name: appsyncLambdaRole
    })

    await lambda.create({
        srcLocation,
        zipLocation,
        name: appsyncLambdaName,
        handler: "index.handler",
        role: `arn:aws:iam::${ACCOUNT_ID}:role/${appsyncLambdaRole}`,
    })

    await dynamodb.create({
        name: dbName,
        PK: 'id',
        SK: false
    })

    console.log('done')

}


main()
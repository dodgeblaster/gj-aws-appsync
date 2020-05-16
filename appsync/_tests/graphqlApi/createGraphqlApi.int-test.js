const graphqlApi = require('../../graphqlApi/logic')
const getApi = require('../../graphqlApi/aws/get')
describe('graphqlApi', () => {
    test('can create', async (done) => {
        const createInput = {
            name: 'NAME',
            state: 'STATE'
        }

        const result = await graphqlApi.createGraphQLApi()
        expect(result).toBe('STATE')
        done()
    })
})
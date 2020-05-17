const create = require('../aws/graphqlApiCreate')
const list = require('../aws/graphqlApiList')
const remove = require('../aws/graphqlApiRemove')

module.exports = {
    createGraphQLApi: async name => {
        const apis = await list()

        if (apis.filter(x => x.name === name).length > 0) {
            const x = apis.filter(x => x.name === name)[0]
            return {
                data: x
            }
        }

        return await create(name)
    },
    removeGraphQLApi: remove
}
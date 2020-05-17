const create = require('../../actions/appsyncGraphqlApiCreate')
const list = require('../../actions/appsyncGraphqlApiList')
const remove = require('../../actions/appsyncGraphqlApiRemove')

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
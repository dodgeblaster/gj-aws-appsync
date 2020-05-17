const create = require('../aws/schemaCreate')
const utils = require('../utils')

module.exports = {
    createSchema: async (id, newSchema, oldChecksum = '') => {
        const newChecksum = utils.checksum(newSchema)
        if (newChecksum === oldChecksum) {
            return {
                status: 'SKIP',
                data: {},
                checksum: ''
            }
        }

        const result = await create(id, newSchema)
        if (result.status === 'ERROR') {
            return {
                status: 'ERROR',
                data: result.e,
                checksum: ''
            }
        }

        return {
            status: 'SUCCESS',
            data: result.data,
            checksum: newChecksum
        }
    }
}
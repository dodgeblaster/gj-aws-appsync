module.exports = {
    Query: {
        getHello: async () => {
            return {
                hello: 'hello',
                id: '1234',
                name: 'NAMEE448'
            }
        },

        something: async () => {
            return {
                id: '1234',
                name: 'Dark Coffee 1'
            }
        },

        product: async () => {
            return {
                id: '1234',
                product: 'Light Coffee'
            }
        },

        getProduct: {
            type: 'DYNAMO',
            action: 'GET',
            table: 'example'
        }
    },

    Mutation: {
        createProduct: {
            type: 'DYNAMO',
            action: 'CREATE',
            table: 'example'
        },

        removeProduct: {
            type: 'DYNAMO',
            action: 'REMOVE',
            table: 'example'
        },
    }
}

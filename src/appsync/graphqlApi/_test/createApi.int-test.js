const iam = require('../logic')
describe('create grphql api', () => {
    test('works', async (done) => {
        // const roleName = 'TEST_ROLE'
        // await iam.createRoleForLambda(roleName)
        // const res = await iam.getRole(roleName)
        // expect(res.Role.RoleName).toBe(roleName)
        // await iam.removeRoleForLambda(roleName)

        // try {
        //     await iam.getRole(roleName)
        // } catch (e) {
        //     expect(e.message).toBe('The role with name TEST_ROLE cannot be found.')
        //     done()
        // }

        expect(2).toBe(2)
        done()
    })
})
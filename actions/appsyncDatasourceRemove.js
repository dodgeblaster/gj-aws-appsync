module.exports = async (apiId, name) => {
    const params = {
        apiId,
        name
    }

    appsync.deleteDataSource(params, function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
    })
}
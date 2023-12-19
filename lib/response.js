const response = (statusCode, data, message, res, pagination) => {
    res.status(statusCode).json({
        payload: {
            status_code: statusCode,
            data,
            message
        },
        pagination
    })
}

module.exports = response
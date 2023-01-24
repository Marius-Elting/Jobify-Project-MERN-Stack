const errorHandlerMiddleware = (err, req, res, next) => {

    console.log(err.message)

    if (err.name === "ValidationError") {
        res.status(400).json(Object.values(err.errors).map(item => item.message).join(","))
    }
    if (err.code && err.code === 11000) {
        res.status(400).json(`${Object.keys(err.keyValue)} field has to be unique`)
    }
    res.status(err.statusCode).json({ msg: err.message })
}

export default errorHandlerMiddleware
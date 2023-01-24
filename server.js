import "express-async-errors"
import express from "express"
import "./config/config.js"
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import connectDB from "./db/connect.js"
import authRouter from "./routes/authRoutes.js"
import jobsRouter from "./routes/jobsRoutes.js"
import morgan from "morgan"
import authenticateUser from './middleware/auth.js';



const app = express()
const PORT = process.env.PORT || 9898



app.use(morgan("dev"))
app.use(express.json())



app.get("/", (req, res) => {
    throw new Error("Error")
    res.send("welcome")
})

app.get("/api/v1", (req, res) => {
    throw new Error("Error")
    res.send("API")
})

app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use("/api/v1/auth", authRouter)



app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)




console.log(process.env.MONGO_URL)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(PORT, () => console.log("Server is Running"))
    } catch (err) {
        console.log(err)
    }
}

start()
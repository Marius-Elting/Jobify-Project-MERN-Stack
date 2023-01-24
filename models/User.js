import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// creates an user and send it to the Database
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlenght: 3,
        maxlenght: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        select: false,
        minlenght: 6,
    },
    lastName: {
        type: String,
        maxlenght: 20,
        trim: true,
        default: "lastName"
    },
    location: {
        type: String,
        maxlenght: 20,
        trim: true,
        default: "my city"
    },
})

UserSchema.pre("save", async function () {

    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


export default mongoose.model("User", UserSchema)
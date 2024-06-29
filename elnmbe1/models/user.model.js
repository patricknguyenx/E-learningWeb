// server/models/user.model.ts
require("dotenv").config()
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"]
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function(value) {
          return emailRegexPattern.test(value)
        },
        message: "please enter a valid email"
      },
      unique: true
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },
    avatar: {
      public_id: String,
      url: String
    },
    role: {
      type: String,
      default: "user"
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    courses: [
      {
        courseId: String
      }
    ]
  },
  { timestamps: true }
)

// Hash Password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// sign access token
userSchema.methods.SignAccessToken = function() {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m"
  })
}

// sign refresh token
userSchema.methods.SignRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d"
  })
}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const userModel = mongoose.model("User", userSchema)

export default userModel

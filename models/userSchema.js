import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  // select:Flase  means when we Get User In response it will excluded From Response Not send to User
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



//! userSchema.pre means before Saving User Schema Do this means Hash the User Password then Save it
userSchema.pre("save", async function (next) {
  // no Chnage In Password Then Execute Next or do next Task
  if (!this.isModified("password")) {
    next();
  }
  // if New Password Or New user Registered
  // get Password and hash by bcrypt module
  // 10 no of rounds
  this.password = await bcrypt.hash(this.password, 10);
});

// ! Impt To Use userSchema.methods as method gives Error


// Now Compare Passwords to Login 


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// it will Generate A Jwt Token When Either User Login or Register 
// Called in Util and Auth 
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);

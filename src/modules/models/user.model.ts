import mongoose, { Schema } from "mongoose"
import { User } from "./types"

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

const UserModel = mongoose.model<User>('users', userSchema)

class MyUser {
  
}

export default UserModel
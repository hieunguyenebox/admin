import { hashSync, genSaltSync } from "bcrypt"
import UserModel from "../models/user.model"
import requireAuth from "./auth"
import { Req } from "request"
import { User } from "modules/models/types"

export const findOneById = async (id: string) => {
  const user = await UserModel.findOne({ _id: id })
  return user
}

export const createAdmin = async () => {

  const adminEmail = 'admin@admin.com'

  const exists = await UserModel.exists({ email: adminEmail })

  if (!exists) {

    const user: User = new UserModel
    user.email = adminEmail

    // create salt
    const salt = genSaltSync(10)
    user.password = hashSync('admin@_@#123', salt)
    user.name = 'admin'
    user.salt = salt
    user.save()

    return true
  }
}

export const me = (_, req: Req) => {
  const user: User = req.user
  if (user) {
    return {
      id: user.id,
      name: user.name
    }
  }
}
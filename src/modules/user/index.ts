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

  const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } = process.env

  const exists = await UserModel.exists({ email: DEFAULT_ADMIN_EMAIL })

  if (!exists) {

    const user: User = new UserModel
    user.email = DEFAULT_ADMIN_EMAIL

    // create salt
    const salt = genSaltSync(10)
    user.password = hashSync(DEFAULT_ADMIN_PASSWORD, salt)
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
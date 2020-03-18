import UserModel from "../models/user.model"
import bcrypt from 'bcrypt'

export const signIn = async (email: string, password: string, done: any) => {
  const user = await UserModel.findOne({ email })
  if (!user) return done(null, false, { message: 'Incorrect email or password' });
  if (user.password === bcrypt.hashSync(password, user.salt)) {
    done(null, { id: user.id })
  } else {
    done(null, false, { message: 'Incorrect email or password' })
  }
}
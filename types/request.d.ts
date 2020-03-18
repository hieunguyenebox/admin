import { Request } from "express"

export interface Req extends Request {
  user: any
  logIn: any
  logout: any
}

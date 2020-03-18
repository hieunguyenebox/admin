import { connectDB } from "./modules/db"
import { Express } from 'express'

export default async (server: Express) => {
  connectDB()
}
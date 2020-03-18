
import mongoose from 'mongoose'

export const getDBUri = (): string => {
  const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
    DB_REPLICA,
  } = process.env

  const replica = DB_REPLICA === 'true'
  let credentials = ''
  if (DB_PASSWORD) {
    credentials = `${DB_USER}:${DB_PASSWORD}@`
  }

  const connectUri = `${replica ? 'mongodb+srv' : 'mongodb'}://${credentials}${DB_HOST}/${DB_NAME}${replica ? '?retryWrites=true&w=majority' : ''}`

  return connectUri
}

export const connectDB = async () => {

  const connectUri = getDBUri()
  mongoose.connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log(`======== Connected to Database ${process.env.DB_NAME} ==========`))
    .catch(err => console.error(err))

}
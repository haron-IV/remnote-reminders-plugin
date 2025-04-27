import mongoose from 'mongoose'
import { log } from '../logger'

export const initDatabaseConnection = async (mongodbURI: string) => {
  mongoose
    .connect(mongodbURI)
    .then(() => {
      log.info('⇉ MongoDB connected')
      console.log('')
    })
    .catch((err: unknown) => {
      log.error('MongoDB connection error:', err)
    })
}

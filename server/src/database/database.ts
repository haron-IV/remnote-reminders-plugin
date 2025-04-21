import mongoose from 'mongoose'

export const initDatabaseConnection = async (mongodbURI: string) => {
  mongoose
    .connect(mongodbURI)
    .then(() => {
      console.log('MongoDB connected')
    })
    .catch((err: unknown) => {
      console.log('MongoDB connection error:', err)
    })
}

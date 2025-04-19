import { Express } from 'express'
import { RegisterRemindersRequest, RegisterRemindersResponse } from './types.js'
import { RemindersModel } from './schemas.js'

export const registerRemindersController = (app: Express) => {
  app.post(
    '/register-reminders',
    async (req: RegisterRemindersRequest, res: RegisterRemindersResponse) => {
      try {
        const { chatId, reminders, timestamp } = req.body
        if (!chatId) throw new Error('chatId not specified')

        RemindersModel.findOneAndReplace(
          { chatId },
          { chatId, reminders, timestamp },
          { upsert: true } // Create a new document if it doesn't exist
        ).then(() => {
          res.status(200).send(req.body)
        })
      } catch (error: unknown) {
        console.error('Error saving reminders:', error)
        // return res.status(500).send('Error saving reminders')
      }
    }
  )
}

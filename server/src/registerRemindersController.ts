import type { Express } from 'express'
import { RegisterRemindersRequest, RegisterRemindersResponse } from './types.js'
import { RemindersModel } from './schemas.js'
import { RemindersData } from '@remnote-reminders-plugin/shared'

/**
 * @description It filters the reminders in order to keep only the reminders that were changed
 */
const mapRemindersData = async (incomingRemindersData: RemindersData) => {
  const userRemindersFromDB = await RemindersModel.findOne({ chatId: incomingRemindersData.chatId })
  const { reminders: incomingReminders } = incomingRemindersData

  return incomingReminders.map(({ remId, date, time, text, ...rest }) => {
    const reminderFromDB = userRemindersFromDB?.reminders.find(
      (reminder) => reminder.remId === remId
    )
    if (!reminderFromDB) return { remId, date, time, text, ...rest }

    const reminderNotUpdated =
      date === reminderFromDB.date && time === reminderFromDB.time && text === reminderFromDB.text

    if (reminderNotUpdated && reminderFromDB.sent) return reminderFromDB
    else return { remId, date, time, text, ...rest }
  })
}

export const registerRemindersController = (app: Express) => {
  app.post(
    '/register-reminders',
    async ({ body }: RegisterRemindersRequest, res: RegisterRemindersResponse) => {
      try {
        const { chatId } = body
        if (!chatId) throw new Error('chatId not specified')

        await RemindersModel.findOneAndReplace(
          { chatId },
          { ...body, reminders: await mapRemindersData(body) },
          { upsert: true } // Create a new document if it doesn't exist
        ).then(() => {
          res.status(200).send(body)
        })
      } catch (error: unknown) {
        console.error('Error saving reminders:', error)
        // return res.status(500).send('Error saving reminders')
      }
    }
  )
}

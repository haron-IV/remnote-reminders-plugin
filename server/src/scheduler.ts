import { Reminder } from '@remnote-reminders-plugin/shared'
import { RemindersModel } from './schemas.js'

/**
 * @description It fetches all reminders from the db that are past the current time and not sent yet.
 */
const getAllPastReminders = async () => {
  const now = new Date().toISOString()

  return await RemindersModel.aggregate<{ chatId: number; reminder: Reminder }>([
    { $unwind: '$reminders' },
    {
      $match: {
        'reminders.UTCTime': { $lte: now },
        'reminders.sent': false,
      },
    },
    {
      $project: {
        chatId: 1,
        reminder: '$reminders',
      },
    },
  ])
}

const updateReminders = async (chatId: number, remId: string) => {
  await RemindersModel.updateOne(
    { chatId, 'reminders.remId': remId },
    {
      $set: {
        'reminders.$.sent': true,
      },
    }
  )
}

export const scheduler = () => {
  setInterval(async () => {
    const pastReminders = await getAllPastReminders()
    console.log(`Found ${pastReminders.length} past reminders`)
    for (const { chatId, reminder } of pastReminders) await updateReminders(chatId, reminder.remId)
  }, 10_000)
}

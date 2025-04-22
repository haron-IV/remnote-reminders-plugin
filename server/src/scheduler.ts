import type { Reminder, RemindersData } from '@remnote-reminders-plugin/shared'
import { RemindersModel } from './schemas.js'
import { Telegram } from 'telegraf'
import { env } from './env.js'

interface AggregatedReminders {
  chatId: RemindersData['chatId']
  reminder: Reminder
}

/**
 * @description It fetches all reminders from the db that are past the current time and not sent yet.
 */
const getAllPastReminders = async () => {
  const now = new Date().toISOString() // UTC

  return await RemindersModel.aggregate<AggregatedReminders>([
    { $unwind: '$reminders' },
    {
      $match: {
        'reminders.UTCTime': { $lte: now },
        'reminders.sent': false,
      },
    },
    { $project: { chatId: 1, reminder: '$reminders' } },
  ])
}

const flagReminderAsSent = async (chatId: number, remId: string) =>
  await RemindersModel.updateOne(
    { chatId, 'reminders.remId': remId },
    { $set: { 'reminders.$.sent': true } }
  )

export const scheduler = (telegram: Telegram) => {
  setInterval(async () => {
    const pastReminders = await getAllPastReminders()
    console.log(
      `[${new Date().getHours()}:${new Date().getMinutes()}] Found ${pastReminders.length} past reminders`
    )
    for (const { chatId, reminder } of pastReminders) {
      if (!chatId) return
      // the url is url for github pages and the index.html that is inside this repo under /redirection-page directory
      // this message line hase to be that ugly broken because of message formatting on telegram
      telegram.sendMessage(
        chatId,
        `🔔 <b>Reminder${reminder.text ? ':' : ''}</b> ${reminder.text ?? ''} 
Click the link to <b><a href="https://haron-iv.github.io/remnote-reminders-plugin/redirection-page/?deeplink=${reminder.deeplink}&reminderText=${encodeURI(reminder.text || '')}">Open Remnote</a></b>`,

        { parse_mode: 'HTML' }
      )
      await flagReminderAsSent(chatId, reminder.remId)
    }
  }, env.schedulerIntervalMs)
}

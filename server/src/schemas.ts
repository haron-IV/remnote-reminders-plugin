import { Schema, model } from 'mongoose'

const ReminderSchema = new Schema({
  date: { type: String, required: false },
  time: { type: String, required: false },
  timezone: { type: String, required: false },
  UTCTime: { type: String, required: false },
  text: { type: String, required: false },
  remId: { type: String, required: true },
  timestamp: { type: Number, required: true },
  deeplink: { type: String, required: true },
  sent: { type: Boolean, default: false },
})

const RemindersDataSchema = new Schema({
  chatId: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  reminders: [ReminderSchema],
})

export const RemindersModel = model('Reminders', RemindersDataSchema)

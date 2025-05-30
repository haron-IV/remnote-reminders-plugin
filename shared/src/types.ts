/**
 * Used for storing all the reminders. This schema is also sended to the server
 */
export interface RemindersData {
  chatId?: number
  timestamp?: number
  reminders: Reminder[]
}

export interface Reminder {
  date?: string
  time?: string
  UTCTime?: string
  text?: string
  remId: string
  timestamp: number
  deeplink: string
}

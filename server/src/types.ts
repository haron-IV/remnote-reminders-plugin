import { Request, Response } from 'express'

export type RegisterRemindersRequest = Request<object, RemindersData, RemindersData, object>
export type RegisterRemindersResponse = Response<RemindersData, RemindersData>

export interface Reminder {
  date?: string
  deeplink: string
  remId: string
  text?: string
  time?: string
  timestamp: number
}

export interface RemindersData {
  chatId?: number
  reminders: Reminder[]
  timestamp?: number
}

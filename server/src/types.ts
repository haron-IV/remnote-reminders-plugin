import type { RemindersData } from '@remnote-reminders-plugin/shared'
import type { Request, Response } from 'express'

export type RegisterRemindersRequest = Request<object, RemindersData, RemindersData, object>
export type RegisterRemindersResponse = Response<RemindersData, RemindersData>
